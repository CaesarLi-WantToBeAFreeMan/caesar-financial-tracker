package com.caesarjlee.caesarfinancialtracker.utilities;

import com.caesarjlee.caesarfinancialtracker.dtos.*;
import com.caesarjlee.caesarfinancialtracker.entities.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.dates.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.entities.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.records.*;
import com.caesarjlee.caesarfinancialtracker.repositories.*;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import com.opencsv.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import org.apache.poi.EmptyFileException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.*;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ImportFiles {
    private final CategoryRepository categoryRepository;
    private final RecordRepository   recordRepository;
    private final ObjectMapper       objectMapper;
    private final ProfileService     profileService;

    private final List<DateTimeFormatter> FORMATTERS = List.of(
        // numeric patterns
        DateTimeFormatter.ofPattern("M-d-uuuu"), DateTimeFormatter.ofPattern("M/d/uuuu"),
        DateTimeFormatter.ofPattern("uuuu-M-d"), DateTimeFormatter.ofPattern("uuuu/M/d"),

        // case-insensitive month name patterns
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("MMM-d-uuuu").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("MMM/d/uuuu").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("uuuu-MMM-d").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("uuuu/MMM/d").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("MMMM-d-uuuu").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("MMMM/d/uuuu").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("uuuu-MMMM-d").toFormatter(Locale.ENGLISH),
        new DateTimeFormatterBuilder().parseCaseInsensitive().appendPattern("uuuu/MMMM/d").toFormatter(Locale.ENGLISH));

    private List<String []> readCsv(MultipartFile file, char separator) {
        try(Reader reader = new InputStreamReader(file.getInputStream())) {
            return new CSVReaderBuilder(reader)
                .withCSVParser(new CSVParserBuilder().withSeparator(separator).build())
                .build()
                .readAll();
        } catch(Exception e) {
            throw separator == ',' ? new InvalidCsvFileException(file.getOriginalFilename())
                                   : new InvalidTsvFileException(file.getOriginalFilename());
        }
    }

    private List<String []> readExcel(MultipartFile file) {
        try(Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet           sheet     = workbook.getSheetAt(0);
            DataFormatter   formatter = new DataFormatter();
            List<String []> data      = new ArrayList<>();
            for(Row row : sheet) {
                int       size = Math.max(0, row.getLastCellNum());
                String [] line = new String [size];
                for(int i = 0; i < size; i++)
                    line [i] = formatter.formatCellValue(row.getCell(i));
                data.add(line);
            }
            return data;
        } catch(Exception e) {
            throw new InvalidExcelFileException(file.getOriginalFilename());
        }
    }

    private List<String []> readJson(MultipartFile file) {
        try {
            List<Map<String, Object>> raw = objectMapper.readValue(file.getInputStream(), new TypeReference<>() {});
            if(raw.isEmpty())
                throw new EmptyFileException();
            List<String>    headers = raw.get(0).keySet().stream().sorted().toList();
            List<String []> table   = new ArrayList<>();
            table.add(headers.toArray(String []::new));
            for(var row : raw) {
                String [] line = new String [headers.size()];
                for(int i = 0; i < headers.size(); i++)
                    line [i] = Objects.toString(row.get(headers.get(i)), null);
                table.add(line);
            }
            return table;
        } catch(Exception e) {
            throw new InvalidJsonFileException(file.getOriginalFilename());
        }
    }

    private void validateHeaders(String [] headers, Set<String> allowed, Set<String> required) {
        Set<String> headerSet = new HashSet<>(Arrays.asList(headers));
        for(String header : headers)
            if(!allowed.contains(header))
                throw new InvalidRequiredColumnException(header);
        for(String require : required)
            if(!headerSet.contains(require))
                throw new InvalidRequiredColumnException(require);
    }

    private boolean isEmptyRow(String [] row){
        return Arrays.stream(row).allMatch(cell -> cell == null || cell.isBlank());
    }

    private String getCell(String [] row, int index) {
        if(row == null || index >= row.length)
            return null;
        String value = row [index];
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private LocalDate parseDate(String date) {
        if(date == null || date.isBlank())
            throw new RecordDateEmptyException();
        for(DateTimeFormatter formatter : FORMATTERS)
            try {
                LocalDate parsedDate = LocalDate.parse(date.trim(), formatter);
                if(parsedDate.isAfter(LocalDate.now()))
                    throw new InvalidRecordDateException(date + " must <= " + LocalDate.now().toString());
                return parsedDate;
            } catch(Exception ignore) {}
        throw new InvalidDateFormatException();
    }

    private BigDecimal parsePrice(String price) {
        if(price == null || price.isBlank())
            throw new RecordPriceEmptyException();
        try {
            BigDecimal parsedPrice = new BigDecimal(price.trim());
            if(parsedPrice.compareTo(BigDecimal.ZERO) < 0)
                throw new InvalidRecordPriceException(price + " must be >= 0");
            if(parsedPrice.scale() > 2)
                throw new InvalidRecordPriceException(price + " must have at most 2 decimal places");
            return parsedPrice.setScale(2, RoundingMode.UNNECESSARY);
        } catch(NumberFormatException e) {
            throw new InvalidRecordPriceException(price + " must be a number");
        } catch(ArithmeticException e){
            throw new InvalidRecordPriceException(price + " must have at most 2 decimal places");
        }
    }

    private String parseType(String type){
        if(type == null || type.isBlank())
            throw new RecordTypeEmptyException();
        String parsedType = type.trim().toLowerCase();
        if(!parsedType.equals("income") && !parsedType.equals("expense"))
            throw new InvalidRecordTypeException(parsedType);
        return parsedType;
    }

    private ImportResponse handleImport(List<String []> table, Object entity) {
        if(table == null || table.isEmpty())
            throw new EmptyFileException();
        ImportResponse response = new ImportResponse();
        String []      headers  = Arrays.stream(table.get(0))
                                                    .map(header -> header == null ? "" : header.toLowerCase())
                                                    .toArray(String []::new);
        ProfileEntity  profile  = profileService.getCurrentProfile();

        if(entity instanceof CategoryEntity) {
            validateHeaders(headers, Set.of("name", "type", "icon"), Set.of("name", "type"));
            Set<String> existingKeys = categoryRepository.findByProfileId(profile.getId())
                                           .stream()
                                           .map(category -> category.getName().trim() + ":" + category.getType())
                                           .collect(Collectors.toSet());
            int index = 1;
            for(var row : table) {
                if(row == table.get(0))
                    continue;
                index++;
                if(isEmptyRow(row))
                    continue;
                try {
                    String name = null, type = null, icon = null;
                    for(int i = 0; i < headers.length; i++) {
                        String value = getCell(row, i);
                        switch(headers [i]) {
                            case "name" -> name = value;
                            case "type" -> type = value;
                            case "icon" -> icon = value;
                        }
                    }
                    if(name == null)
                        throw new CategoryNameEmptyException();
                    if(type == null)
                        throw new CategoryTypeEmptyException();
                    String validType = parseType(type);
                    if(!Set.of("income", "expense").contains(validType))
                        throw new InvalidCategoryTypeException(validType);
                    String currentKey = name.trim() + ":" + validType;
                    if(existingKeys.contains(currentKey)) {
                        response.fail("duplicate category at row #" + index);
                        continue;
                    }
                    categoryRepository.save(
                        CategoryEntity.builder()
                                    .name(name
                                    .trim())
                                    .type(validType)
                                    .icon((icon == null || icon.isBlank() ? name : icon).trim())
                                    .profile(profile)
                                    .build());
                    existingKeys.add(currentKey);
                    response.success();
                } catch(CategoryNameEmptyException e) {
                    response.fail("empty name at row #" + index);
                } catch(CategoryTypeEmptyException e) {
                    response.fail("empty type at row #" + index);
                } catch(InvalidCategoryTypeException e) {
                    response.fail(e.getMessage() + " at row #" + index);
                } catch(Exception e) {
                    response.fail("invalid data at row #" + index);
                }
            }
        } else if(entity instanceof RecordEntity){
            validateHeaders(headers, Set.of("name", "type", "date", "price", "category", "icon", "description"),
                            Set.of("name", "type", "date", "price", "category"));
            Map<String, CategoryEntity> categories =
                categoryRepository.findByProfileId(profile.getId())
                    .stream()
                    .collect(Collectors.toMap(category -> category.getName().trim() + ":" + category.getType(),
                            category -> category));
            int index = 1;
            for(var row : table) {
                if(row == table.get(0))
                    continue;
                index++;
                if(isEmptyRow(row))
                    continue;
                try {
                    String name = null, type = null, date = null, price = null, icon = null, description = null, category = null;
                    for(int i = 0; i < headers.length; i++) {
                        String value = getCell(row, i);
                        switch(headers [i]) {
                            case "name"        -> name = value;
                            case "type"        -> type = value;
                            case "date"        -> date = value;
                            case "price"       -> price = value;
                            case "icon"        -> icon = value;
                            case "description" -> description = value;
                            case "category"    -> category = value;
                        }
                    }
                    if(name == null || name.isBlank())
                        throw new RecordNameEmptyException();
                    if(type == null || type.isBlank())
                        throw new RecordTypeEmptyException();
                    if(date == null || date.isBlank())
                        throw new RecordDateEmptyException();
                    if(price == null || price.isBlank())
                        throw new RecordPriceEmptyException();
                    if(category == null || category.isBlank())
                        throw new CategoryNameEmptyException();
                    String validType = parseType(type), key = category.trim() + ":" + validType;
                    CategoryEntity categoryEntity = categories.get(key);
                    if(categoryEntity == null)
                        throw new CategoryNotFoundException(category);
                    recordRepository.save(RecordEntity.builder()
                                        .name(name.trim())
                                        .type(validType)
                                        .date(parseDate(date))
                                        .price(parsePrice(price))
                                        .icon(icon == null || icon.isBlank() ? "" : icon.trim())
                                        .description((description == null || description.isBlank() ? name : description).trim())
                                        .category(categoryEntity)
                                        .profile(profile)
                                        .build());
                    response.success();
                } catch(CategoryNameEmptyException e) {
                    response.fail("empty category name at row #" + index);
                } catch(CategoryNotFoundException e) {
                    response.fail("category doesn't exist at row #" + index);
                } catch(RecordNameEmptyException e) {
                    response.fail("empty name at row #" + index);
                } catch(RecordTypeEmptyException e) {
                    response.fail("empty type at row #" + index);
                } catch(RecordDateEmptyException e) {
                    response.fail("empty date at row #" + index);
                } catch(RecordPriceEmptyException e) {
                    response.fail("empty price at row #" + index);
                } catch(InvalidDateFormatException e) {
                    response.fail(e.getMessage() + " at row #" + index);
                } catch(InvalidRecordDateException e) {
                    response.fail(e.getMessage() + " at row #" + index);
                } catch(InvalidRecordPriceException e) {
                    response.fail(e.getMessage() + " at row #" + index);
                } catch(InvalidRecordTypeException e) {
                    response.fail(e.getMessage() + " at row #" + index);
                } catch(Exception e) {
                    response.fail("invalid data at row #" + index);
                }
            }
        } else
            throw new InvalidEntityException(entity.getClass().getSimpleName());
        return response;
    }

    public ImportResponse importData(MultipartFile file, Object entity) {
        if(file == null || file.isEmpty())
            throw new EmptyFileException();
        String filename = file.getOriginalFilename();
        if(filename == null || !filename.contains("."))
            throw new InvalidFilenameException();
        String          filetype = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        List<String []> table    = switch(filetype) {
            case "csv"          -> readCsv(file, ',');
            case "tsv"          -> readCsv(file, '\t');
            case "xls", "xlsx"  -> readExcel(file);
            case "json"         -> readJson(file);
            default             -> throw new InvalidFiletypeException(filetype);
        };
        return handleImport(table, entity);
    }
}
