package com.caesarjlee.caesarfinancialtracker.utilities;

import com.caesarjlee.caesarfinancialtracker.dtos.CategoryExportDto;
import com.caesarjlee.caesarfinancialtracker.entities.CategoryEntity;
import com.caesarjlee.caesarfinancialtracker.entities.ExpenseEntity;
import com.caesarjlee.caesarfinancialtracker.entities.IncomeEntity;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.ExportFileException;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.entities.InvalidEntityException;
import com.caesarjlee.caesarfinancialtracker.exceptions.files.filetypes.InvalidFiletypeException;
import com.caesarjlee.caesarfinancialtracker.repositories.CategoryRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.ExpenseRepository;
import com.caesarjlee.caesarfinancialtracker.repositories.IncomeRepository;
import com.caesarjlee.caesarfinancialtracker.services.ProfileService;

import com.opencsv.CSVWriter;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExportFiles {
    private final CategoryRepository categoryRepository;
    private final IncomeRepository   incomeRepository;
    private final ExpenseRepository  expenseRepository;
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
            Long                    profileId = profileService.getCurrentProfile().getId();
            List<CategoryExportDto> data =
                categoryRepository.findByProfileId(profileId)
                    .stream()
                    .map(category -> new CategoryExportDto(category.getName(), category.getType(), category.getIcon()))
                    .toList();
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
            return table;
        } else if(entity instanceof IncomeEntity) {
            return table;
        } else if(entity instanceof ExpenseEntity) {
            return table;
        }
        throw new InvalidEntityException(entity.getClass().getSimpleName());
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
