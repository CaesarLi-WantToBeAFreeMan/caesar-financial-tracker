package com.caesarjlee.caesarfinancialtracker.utilities;

import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ExpenseEntity;
import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.CategoryNameEmptyException;
import com.caesarjlee.caesarfinancialtracker.exceptions.categories.InvalidCategoryTypeException;
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
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
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
            CSVReader csvReader = new CSVReaderBuilder(reader)
                                      .withCSVParser(new CSVParserBuilder().withSeparator(separator).build())
                                      .build();
            return csvReader.readAll();
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
                short last = row.getLastCellNum();
                if(last <= 0)
                    continue;
                String [] rowData = new String [last];
                for(int i = 0; i < last; i++)
                    rowData [i] = formatter.formatCellValue(row.getCell(i));
                data.add(rowData);
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
                    Object v = row.get(headers.get(i));
                    line [i] = v == null ? null : String.valueOf(v);
                }
                table.add(line);
            }
            return table;
        } catch(Exception e) {
            throw new InvalidJsonFileException(file.getOriginalFilename());
        }
    }

    private Map<String, Long> handleImport(List<String []> data, Object entity) {
        if(data == null || data.isEmpty())
            throw new EmptyFileException();
        String [] headers = normalizeHeaders(data.get(0));
        validateHeaders(headers, entity);
        long success = 0, failed = 0;
        for(int rowIndex = 1; rowIndex < data.size(); rowIndex++) {
            String [] row      = data.get(rowIndex);
            int       humanRow = rowIndex + 1;
            try {
                if(entity instanceof CategoryEntity) {
                    CategoryEntity category = parseCategory(headers, row, humanRow);
                    categoryRepository.save(category);
                } else if(entity instanceof IncomeEntity) {
                    IncomeEntity income = parseIncome(headers, row, humanRow);
                    incomeRepository.save(income);
                } else if(entity instanceof ExpenseEntity) {
                    ExpenseEntity expense = parseExpense(headers, row, humanRow);
                    expenseRepository.save(expense);
                } else
                    throw new InvalidEntityException(entity.getClass().getSimpleName());
                success++;
            } catch(RuntimeException e) {
                failed++;
            }
        }
        return Map.of("success", success, "failed", failed);
    }

    private String [] normalizeHeaders(String [] rawHeaders) {
        if(rawHeaders == null || rawHeaders.length == 0)
            throw new InvalidRequiredColumnException("header");
        String [] headers = new String [rawHeaders.length];
        for(int i = 0; i < rawHeaders.length; i++)
            headers [i] = rawHeaders [i] == null ? "" : rawHeaders [i].trim().toLowerCase(Locale.ENGLISH);
        return headers;
    }

    private void validateHeaders(String [] headers, Object entity) {
        Set<String> allowed, required;
        if(entity instanceof CategoryEntity) {
            allowed  = CATEGORY_COLUMNS;
            required = Set.of("name", "type");
        } else if(entity instanceof IncomeEntity || entity instanceof ExpenseEntity) {
            allowed  = INCOME_EXPENSE_COLUMNS;
            required = Set.of("name", "date", "price");
        } else
            throw new InvalidEntityException(entity.getClass().getSimpleName());
        for(String header : headers)
            if(!allowed.contains(header))
                throw new InvalidRequiredColumnException(header);
        for(String column : required) {
            if(!Arrays.asList(headers).contains(column))
                throw new InvalidRequiredColumnException(column);
        }
    }

    private CategoryEntity parseCategory(String [] headers, String [] row, int humanRow) {
        String name = null, type = null, icon = null;
        for(int i = 0; i < headers.length; i++) {
            String key = headers [i], value = getCell(row, i);
            switch(key) {
            case "name" -> name = value;
            case "type" -> type = value;
            case "icon" -> icon = value;
            default       -> throw new InvalidRequiredColumnException(key);
            }
        }
        if(name == null || name.isBlank())
            throw new CategoryNameEmptyException(humanRow);
        String normalizedType = type == null ? "" : type.trim().toLowerCase(Locale.ENGLISH);
        if(!ALLOWED_CATEGORY_TYPES.contains(normalizedType))
            throw new InvalidCategoryTypeException(type, humanRow);
        CategoryEntity category = CategoryEntity.builder()
                                      .name(name)
                                      .type(type)
                                      .icon(icon == null || icon.isBlank() ? null : icon.trim())
                                      .profile(profileService.getCurrentProfile())
                                      .build();
        return category;
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

    public String importData(MultipartFile file, Object entity) throws Exception {
        if(file == null || file.isEmpty())
            throw new EmptyFileException();
        String filename = file.getOriginalFilename();
        if(filename == null || filename.isBlank())
            throw new InvalidFilenameException();
        filename        = filename.toLowerCase(Locale.ENGLISH);
        int dotPosition = filename.lastIndexOf('.');
        if(dotPosition < 0 || dotPosition == filename.length() - 1)
            throw new InvalidFilenameException();
        String          filetype = filename.substring(dotPosition + 1);
        List<String []> table    = switch(filetype) {
            case "csv"           -> readCsv(file, ',');
            case "tsv"           -> readCsv(file, '\t');
            case "xls", "xlsx" -> readExcel(file);
            case "json"          -> readJson(file);
            default                -> throw new InvalidFiletypeException(filetype);
        };
        Map<String, Long> results = handleImport(table, entity);
        return String.format("%d success, %d failed", results.get("success"), results.get("failed"));
    }
}
