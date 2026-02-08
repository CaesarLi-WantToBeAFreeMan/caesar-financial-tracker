package com.caesarjlee.caesarfinancialtracker.utilities;

import com.caesarjlee.caesarfinancialtracker.dtos.ImportResponse;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ExpenseEntity;
import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.entities.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes.*;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.ExpenseRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.IncomeRepository;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import org.apache.poi.EmptyFileException;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.tomcat.util.http.fileupload.InvalidFileNameException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ch.qos.logback.core.model.conditional.ElseModel;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
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

    private static final Set<String> CATEGORY_COLUMNS       = Set.of("name", "type", "icon");
    private static final Set<String> INCOME_EXPENSE_COLUMNS = Set.of("name", "date", "price", "icon", "description");
    private static final Set<String> ALLOWED_CATEGORY_TYPES = Set.of("income", "expense");

    private final List<DateTimeFormatter> FORMATTERS        = List.of(
        // numeric day-month-year
        DateTimeFormatter.ofPattern("d-M-uuuu"), DateTimeFormatter.ofPattern("d/M/uuuu"),

        // numeric month-day-year
        DateTimeFormatter.ofPattern("M-d-uuuu"), DateTimeFormatter.ofPattern("M/d/uuuu"),

        // numeric year-month-day
        DateTimeFormatter.ofPattern("uuuu-M-d"), DateTimeFormatter.ofPattern("uuuu/M/d"),

        // short month name
        DateTimeFormatter.ofPattern("d-MMM-uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("MMM-d-uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("uuuu-MMM-d", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("d/MMM/uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("MMM/d/uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("uuuu/MMM/d", Locale.ENGLISH),

        // full month name
        DateTimeFormatter.ofPattern("d-MMMM-uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("MMMM-d-uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("uuuu-MMMM-d", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("d/MMMM/uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("MMMM/d/uuuu", Locale.ENGLISH),
        DateTimeFormatter.ofPattern("uuuu/MMMM/d", Locale.ENGLISH));

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
                int size = row.getLastCellNum();
                if(size <= 0)
                    continue;
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
            table.add(headers.toArray(new String [0]));
            for(Map<String, Object> row : raw) {
                String [] line = new String [headers.size()];
                for(int i = 0; i < headers.size(); i++) {
                    Object value = row.get(headers.get(i));
                    line [i]     = value == null ? null : value.toString();
                }
                table.add(line);
            }
            return table;
        } catch(Exception e) {
            throw new InvalidJsonFileException(file.getOriginalFilename());
        }
    }

    private ImportResponse handleImport(List<String []> table, Object entity) {
        if(table == null || table.isEmpty())
            throw new EmptyFileException();
        ImportResponse response = new ImportResponse();
        String []      headers  = normalizeHeaders(table.get(0));
        validateHeaders(headers, entity);
        ProfileEntity profile = profileService.getCurrentProfile();
        if(entity instanceof CategoryEntity) {
            Set<String> existingNames = categoryRepository.findByProfileId(profile.getId())
                                            .stream()
                                            .map(category -> category.getName().toLowerCase(Locale.ENGLISH))
                                            .collect(Collectors.toSet());
            Set<String> seenNames = new HashSet<>();
            for(int i = 1; i < table.size(); i++) {
                try {
                    CategoryEntity category = parseCategory(headers, table.get(i), profile);
                    String         key      = category.getName().toLowerCase(Locale.ENGLISH);
                    if(seenNames.contains(key) || existingNames.contains(key)) {
                        response.fail("duplicate name at row #" + (i + 1));
                        continue;
                    }
                    seenNames.add(key);
                    categoryRepository.save(category);
                    response.success();
                } catch(CategoryNameEmptyException e) {
                    response.fail("invalid name at row #" + (i + 1));
                } catch(InvalidCategoryTypeException e) {
                    response.fail("invalid type at row #" + (i + 1));
                } catch(Exception e) {
                    response.fail("invalid data at row #" + (i + 1));
                }
            }
        } else if(entity instanceof IncomeEntity) {
        } else if(entity instanceof ExpenseEntity) {
        } else {
            throw new InvalidEntityException(entity.getClass().getSimpleName());
        }
        return response;
    }

    private String [] normalizeHeaders(String [] raw) {
        return Arrays.stream(raw)
            .map(header -> header == null ? "" : header.trim().toLowerCase(Locale.ENGLISH))
            .toArray(String [] ::new);
    }

    private void validateHeaders(String [] headers, Object entity) {
        if(entity instanceof CategoryEntity) {
            for(String header : headers)
                if(!CATEGORY_COLUMNS.contains(header))
                    throw new InvalidRequiredColumnException(header);
            List<String> requiredColumns = List.of("name", "type");
            for(String column : requiredColumns)
                if(!Arrays.asList(headers).contains(column))
                    throw new InvalidRequiredColumnException(column);
        } else if(entity instanceof IncomeEntity) {
        } else if(entity instanceof ExpenseEntity) {
        } else
            throw new InvalidEntityException(entity.getClass().getSimpleName());
    }

    private CategoryEntity parseCategory(String [] headers, String [] row, ProfileEntity profile) {
        String name = null, type = null, icon = null;
        for(int i = 0; i < headers.length; i++) {
            String value = getCell(row, i);
            switch(headers [i]) {
            case "name" -> name = value;
            case "type" -> type = value;
            case "icon" -> icon = value;
            default       -> throw new InvalidRequiredColumnException(headers [i]);
            }
        }
        if(name == null || name.isBlank())
            throw new CategoryNameEmptyException();
        if(type == null || !ALLOWED_CATEGORY_TYPES.contains(type.toLowerCase()))
            throw new InvalidCategoryTypeException(type);
        return CategoryEntity.builder()
            .name(name.trim())
            .type(type.toLowerCase())
            .icon(icon == null || icon.isBlank() ? null : icon.trim())
            .profile(profile)
            .build();
    }

    private IncomeEntity parseIncome(String [] headers, String [] row, int humanRow) {
        String name = null, date = null, price = null, icon = null, description = null;
        for(int i = 0; i < headers.length; i++) {
            String key = headers [i], value = getCell(row, i);
            switch(key) {
            case "name"        -> name = value;
            case "date"        -> date = value;
            case "price"       -> price = value;
            case "icon"        -> icon = value;
            case "description" -> description = value;
            default              -> throw new InvalidRequiredColumnException(key);
            }
        }
        if(name == null || name.isBlank())
            throw new InvalidRequiredColumnException("name");
        if(date == null || date.isBlank())
            throw new InvalidRequiredColumnException("date");
        if(price == null || price.isBlank())
            throw new InvalidRequiredColumnException("price");
        IncomeEntity income = IncomeEntity.builder()
                                  .name(name.trim())
                                  .date(parseDate(date.trim(), humanRow))
                                  .price(parsePrice(price.trim(), humanRow))
                                  .icon(icon == null || icon.isBlank() ? null : icon.trim())
                                  .description(description == null || description.isBlank() ? null : description.trim())
                                  .profile(profileService.getCurrentProfile())
                                  .build();
        return income;
    }

    private ExpenseEntity parseExpense(String [] headers, String [] row, int humanRow) {
        String name = null, date = null, price = null, icon = null, description = null;
        for(int i = 0; i < headers.length; i++) {
            String key = headers [i], value = getCell(row, i);
            switch(key) {
            case "name"        -> name = value;
            case "date"        -> date = value;
            case "price"       -> price = value;
            case "icon"        -> icon = value;
            case "description" -> description = value;
            default              -> throw new InvalidRequiredColumnException(key);
            }
        }
        if(name == null || name.isBlank())
            throw new InvalidRequiredColumnException("name");
        if(date == null || date.isBlank())
            throw new InvalidRequiredColumnException("date");
        if(price == null || price.isBlank())
            throw new InvalidRequiredColumnException("price");
        ExpenseEntity expense =
            ExpenseEntity.builder()
                .name(name.trim())
                .date(parseDate(date.trim(), humanRow))
                .price(parsePrice(price.trim(), humanRow))
                .icon(icon == null || icon.isBlank() ? null : icon.trim())
                .description(description == null || description.isBlank() ? null : description.trim())
                .profile(profileService.getCurrentProfile())
                .build();
        return expense;
    }

    private String getCell(String [] row, int index) {
        if(row == null || index >= row.length)
            return null;
        String value = row [index];
        return value == null || value.isBlank() ? null : value.trim();
    }

    private LocalDate parseDate(String value, int row) {
        String normalized = value.trim().toLowerCase(Locale.ENGLISH);
        for(DateTimeFormatter formatter : FORMATTERS)
            try {
                return LocalDate.parse(normalized, formatter);
            } catch(DateTimeParseException e) {}
        throw new InvalidRequiredColumnException("date");
    }

    private BigDecimal parsePrice(String value, int row) {
        try {
            return new BigDecimal(value);
        } catch(Exception e) {
            throw new InvalidRequiredColumnException("price");
        }
    }

    public ImportResponse importData(MultipartFile file, Object entity) {
        if(file == null || file.isEmpty())
            throw new EmptyFileException();
        String filename = file.getOriginalFilename();
        if(filename == null || !filename.contains("."))
            throw new InvalidFilenameException();
        String          filetype = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ENGLISH);
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
