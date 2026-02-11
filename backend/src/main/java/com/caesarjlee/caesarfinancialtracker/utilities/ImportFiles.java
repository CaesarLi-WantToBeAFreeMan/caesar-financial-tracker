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

import org.apache.poi.EmptyFileException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.*;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Transactional
public class ImportFiles {
    private final CategoryRepository categoryRepository;
    private final IncomeRepository   incomeRepository;
    private final ExpenseRepository  expenseRepository;
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
            List<String>    headers = new ArrayList<>(raw.get(0).keySet());
            List<String []> table   = new ArrayList<>();
            table.add(headers.toArray(String [] ::new));
            for(Map<String, Object> row : raw) {
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

    private String [] normalizeHeaders(String [] raw) {
        return Arrays.stream(raw)
            .map(header -> header == null ? "" : header.trim().toLowerCase())
            .toArray(String [] ::new);
    }

    private void validateHeaders(String [] headers, Set<String> allowed, List<String> required) {
        for(String header : headers)
            if(!allowed.contains(header))
                throw new InvalidRequiredColumnException(header);
        for(String require : required)
            if(!Arrays.asList(headers).contains(require))
                throw new InvalidRequiredColumnException(require);
    }

    private String getCell(String [] row, int index) {
        if(row == null || index >= row.length)
            return null;
        String value = row [index];
        return value == null || value.isBlank() ? null : value.trim();
    }

    private LocalDate parseDate(String date) {
        LocalDate dateObject = null;
        for(DateTimeFormatter formatter : FORMATTERS)
            try {
                dateObject = LocalDate.parse(date, formatter);
                break;
            } catch(Exception ignore) {}
        if(dateObject == null)
            throw new InvalidDateFormatException();
        if(dateObject.isAfter(LocalDate.now()))
            throw new InvalidRecordDateException(date + " must be <= " + LocalDate.now().toString());
        return dateObject;
    }

    private BigDecimal parsePrice(String price) {
        BigDecimal priceObject = null;
        try {
            priceObject = new BigDecimal(price);
        } catch(Exception e) {
            throw new InvalidRecordPriceException(price + " must be a number");
        }
        if(priceObject.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidRecordPriceException(price + " must be >= 0");
        return priceObject;
    }

    private ImportResponse handleImport(List<String []> table, Object entity) {
        if(table == null || table.isEmpty())
            throw new EmptyFileException();
        ImportResponse response = new ImportResponse();
        String []      headers  = normalizeHeaders(table.get(0));
        ProfileEntity  profile  = profileService.getCurrentProfile();

        if(entity instanceof CategoryEntity) {
            validateHeaders(headers, Set.of("name", "type", "icon"), List.of("name", "type"));
            Set<String> existingKeys = categoryRepository.findByProfileId(profile.getId())
                                           .stream()
                                           .map(category -> category.getName().trim() + ":" + category.getType())
                                           .collect(Collectors.toSet());
            int index = 1;
            for(var row : table) {
                if(row == table.get(0))
                    continue;
                index++;
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
                    if(name == null || name.isBlank())
                        throw new CategoryNameEmptyException();
                    if(type == null || type.isBlank())
                        throw new CategoryTypeEmptyException();
                    String validType = type.trim().toLowerCase();
                    if(!Set.of("income", "expense").contains(validType))
                        throw new InvalidCategoryTypeException(validType);
                    String currentKey = name.trim() + ":" + validType;
                    if(existingKeys.contains(currentKey)) {
                        response.fail("duplicate category at row #" + index);
                        continue;
                    }
                    categoryRepository.save(
                        CategoryEntity.builder().name(name.trim()).type(validType).icon(icon).profile(profile).build());
                    existingKeys.add(currentKey);
                    response.success();
                } catch(CategoryNameEmptyException e) {
                    response.fail("empty name at row #" + index);
                } catch(CategoryTypeEmptyException e) {
                    response.fail("empty type at row #" + index);
                } catch(InvalidCategoryTypeException e) {
                    response.fail("invalid type (only income/expense) at row #" + index);
                } catch(Exception e) {
                    response.fail("invalid data at row #" + index);
                }
            }
        } else if(entity instanceof IncomeEntity || entity instanceof ExpenseEntity) {
            validateHeaders(headers, Set.of("name", "date", "price", "category", "icon", "description"),
                            List.of("name", "date", "price", "category"));
            String                      type = entity instanceof IncomeEntity ? "income" : "expense";
            Map<String, CategoryEntity> categories =
                categoryRepository.findByProfileId(profile.getId())
                    .stream()
                    .filter(category -> category.getType().equalsIgnoreCase(type))
                    .collect(Collectors.toMap(category -> category.getName(), category -> category));
            int index = 1;
            for(var row : table) {
                if(row == table.get(0))
                    continue;
                index++;
                try {
                    String name = null, date = null, price = null, icon = null, description = null, category = null;
                    for(int i = 0; i < headers.length; i++) {
                        String value = getCell(row, i);
                        switch(headers [i]) {
                        case "name"        -> name = value;
                        case "date"        -> date = value;
                        case "price"       -> price = value;
                        case "icon"        -> icon = value;
                        case "description" -> description = value;
                        case "category"    -> category = value;
                        }
                    }
                    if(category == null || category.trim().isBlank())
                        throw new CategoryNameEmptyException();
                    CategoryEntity categoryEntity = categories.get(category.trim());
                    if(categoryEntity == null)
                        throw new CategoryNotFoundException(category);
                    if(name == null || name.isBlank())
                        throw new RecordNameEmptyException();
                    if(date == null || date.isBlank())
                        throw new RecordDateEmptyException();
                    if(price == null || price.isBlank())
                        throw new RecordPriceEmptyException();
                    if(description == null || description.trim().isBlank())
                        description = name;
                    if(type == "income") {
                        incomeRepository.save(IncomeEntity.builder()
                                                  .name(name)
                                                  .date(parseDate(date))
                                                  .price(parsePrice(price))
                                                  .icon(icon)
                                                  .description(description)
                                                  .category(categoryEntity)
                                                  .profile(profile)
                                                  .build());
                    } else {
                        expenseRepository.save(ExpenseEntity.builder()
                                                   .name(name)
                                                   .date(parseDate(date))
                                                   .price(new BigDecimal(price))
                                                   .icon(icon)
                                                   .description(description)
                                                   .category(categoryEntity)
                                                   .profile(profile)
                                                   .build());
                    }
                    response.success();
                } catch(CategoryNameEmptyException e) {
                    response.fail("empty category name at row #" + index);
                } catch(CategoryNotFoundException e) {
                    response.fail("category doesn't exist at row #" + index);
                } catch(RecordNameEmptyException e) {
                    response.fail("empty name at row #" + index);
                } catch(RecordDateEmptyException e) {
                    response.fail("empty date at row #" + index);
                } catch(RecordPriceEmptyException e) {
                    response.fail("empty price at row #" + index);
                } catch(InvalidDateFormatException e) {
                    response.fail("invalid date format at row #" + index);
                } catch(InvalidRecordDateException e) {
                    response.fail("invalid date (<= today) at row #" + index);
                } catch(InvalidRecordPriceException e) {
                    response.fail("invalid price (>= 0) at row #" + index);
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
            case "csv"           -> readCsv(file, ',');
            case "tsv"           -> readCsv(file, '\t');
            case "xls", "xlsx" -> readExcel(file);
            case "json"          -> readJson(file);
            default                -> throw new InvalidFiletypeException(filetype);
        };
        return handleImport(table, entity);
    }
}
