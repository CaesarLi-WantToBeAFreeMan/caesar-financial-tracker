package com.caesarjlee.caesarfinancialtracker.services;

import com.caesarjlee.caesarfinancialtracker.dtos.ExpenseResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.IncomeResponse;
import com.caesarjlee.caesarfinancialtracker.dtos.RecentTransaction;
import com.caesarjlee.caesarfinancialtracker.entities.ProfileEntity;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
    /*
    private final IncomeService  incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    public Map<String, Object>   getDashboardData() {
        ProfileEntity profile     = profileService.getCurrentProfile();
        BigDecimal    totalIncome = incomeService.getTotalIncomes(), totalExpense = expenseService.getTotalExpenses(),
                   totalBalance          = totalIncome.subtract(totalExpense);
        List<IncomeResponse>    incomes  = incomeService.getLatest5Incomes();
        List<ExpenseResponse>   expenses = expenseService.getLatest5Expenses();
        List<RecentTransaction> recentTransactions =
            Stream
                .concat(incomes.stream().map(income
                                               -> new RecentTransaction(income.name(), income.categoryName(), "income",
                                                                        income.price(), income.date(),
    income.createdAt(), income.updatedAt())), expenses.stream().map(expense
                                                -> new RecentTransaction(expense.name(), expense.categoryName(),
                                                                         "expense", expense.price(), expense.date(),
                                                                         expense.createdAt(), expense.updatedAt())))
                .sorted((a, b) -> {
                    int cmp = b.date().compareTo(a.date());
                    if(cmp != 0)
                        return cmp;
                    LocalDateTime aCreatedAt = a.createdAt(), bCreatedAt = b.createdAt();
                    return aCreatedAt == null && bCreatedAt == null ? 0
                    : aCreatedAt == null                              ? 1
                    : bCreatedAt == null                              ? -1
                                                                      : bCreatedAt.compareTo(aCreatedAt);
                })
                .toList();
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalIncome", totalIncome);
        data.put("totalExpense", totalExpense);
        data.put("totalBalance", totalBalance);
        data.put("recent5Incomes", incomes);
        data.put("recent5Expenses", expenses);
        data.put("recentTransactions", recentTransactions);
        return data;
    }
    */
}
