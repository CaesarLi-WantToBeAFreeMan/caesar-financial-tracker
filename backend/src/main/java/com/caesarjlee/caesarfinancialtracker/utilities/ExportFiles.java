package com.caesarjlee.caesarfinancialtracker.utilities;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryExportDto;
import com.caesarjlee.caesarfinancialtracker.entities.*;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.ExportFileException;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.entities.InvalidEntityException;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes.InvalidFiletypeException;
import com.caesarjlee.caesarfinancialtracker.repositories.*;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import com.opencsv.CSVWriter;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.*;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExportFiles {
    private final CategoryRepository categoryRepository;
    private final RecordRepository   recordRepository;
    private final ProfileService     profileService;
    private final ObjectMapper       objectMapper;

    private String                   handleNull(String value) {
        return value == null ? "" : value;
    }

    private byte [] exportCsv(Object entity, char separator) {
        try(ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            OutputStreamWriter    outputStreamWriter =
                new OutputStreamWriter(byteArrayOutputStream, StandardCharsets.UTF_8);
            CSVWriter csvWriter = new CSVWriter(outputStreamWriter, separator, CSVWriter.NO_QUOTE_CHARACTER,
                                                CSVWriter.NO_ESCAPE_CHARACTER, CSVWriter.DEFAULT_LINE_END)) {
            csvWriter.writeAll(buildTable(entity));
            outputStreamWriter.flush();
            return byteArrayOutputStream.toByteArray();
        } catch(Exception e) {
            e.printStackTrace();
            throw new ExportFileException();
        }
    }

    private byte [] exportExcel(Object entity) {
        try(Workbook              workbook              = new XSSFWorkbook();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            Sheet           sheet = workbook.createSheet("Categories");
            List<String []> table = buildTable(entity);
            for(int r = 0; r < table.size(); r++) {
                Row       row  = sheet.createRow(r);
                String [] data = table.get(r);
                for(int c = 0; c < data.length; c++)
                    row.createCell(c).setCellValue(data [c]);
            }
            workbook.write(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        } catch(Exception e) {
            throw new ExportFileException();
        }
    }

    private byte [] exportJson(Object entity) {
        try {
            Long                      profileId = profileService.getCurrentProfile().getId();
            List<Map<String, Object>> data;
            if(entity instanceof CategoryEntity) {
                data = categoryRepository.findByProfileId(profileId)
                           .stream()
                           .map(category -> {
                               Map<String, Object> categories = new LinkedHashMap<>();
                               categories.put("name", handleNull(category.getName()));
                               categories.put("type", handleNull(category.getType()));
                               categories.put("icon", handleNull(category.getIcon()));
                               return categories;
                           })
                           .toList();
            } else if(entity instanceof RecordEntity) {
                data = recordRepository.findByProfileId(profileId)
                           .stream()
                           .map(income -> {
                               Map<String, Object> incomes = new LinkedHashMap<>();
                               incomes.put("name", handleNull(income.getName()));
                               incomes.put("type", handleNull(income.getType()));
                               incomes.put("date", income.getDate().toString());
                               incomes.put("price", income.getPrice());
                               incomes.put("icon", handleNull(income.getIcon()));
                               incomes.put("description", handleNull(income.getDescription()));
                               incomes.put("category", income.getCategory().getName());
                               return incomes;
                           })
                           .toList();
            } else
                throw new InvalidEntityException(entity.getClass().getSimpleName());
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(data);
        } catch(Exception e) {
            throw new ExportFileException();
        }
    }

    private List<String []> buildTable(Object entity) {
        List<String []> table     = new ArrayList<>();
        Long            profileId = profileService.getCurrentProfile().getId();
        if(entity instanceof CategoryEntity) {
            table.add(new String [] {"name", "type", "icon"});
            for(CategoryEntity category : categoryRepository.findByProfileId(profileId))
                table.add(new String [] {handleNull(category.getName()), handleNull(category.getType()),
                                         handleNull(category.getIcon())});
        } else if(entity instanceof RecordEntity) {
            table.add(new String [] {"name", "type", "date", "price", "icon", "description", "category"});
            for(RecordEntity record : recordRepository.findByProfileId(profileId))
                table.add(new String [] {handleNull(record.getName()),
                                         handleNull(record.getType()),
                                         record.getDate().format(DateTimeFormatter.ISO_LOCAL_DATE),
                                         record.getPrice().toPlainString(), handleNull(record.getIcon()),
                                         handleNull(record.getDescription()), record.getCategory().getName()});
        } else
            throw new InvalidEntityException(entity.getClass().getSimpleName());
        return table;
    }

    public byte [] exportData(String filetype, Object entity) {
        return switch(filetype.toLowerCase(Locale.ENGLISH)) {
            case "csv"  -> exportCsv(entity, ',');
            case "tsv"  -> exportCsv(entity, '\t');
            case "xlsx" -> exportExcel(entity);
            case "json" -> exportJson(entity);
            default       -> throw new InvalidFiletypeException(filetype);
        };
    }
}
