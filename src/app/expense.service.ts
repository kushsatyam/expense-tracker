import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'daily_expenses';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenses: any[] = this.loadExpenses();

  addExpense(expense: any) {
    this.expenses.push(expense);
    this.saveExpenses();
  }

  getExpenses(): any[] {
    return this.expenses;
  }

  getCategorySummary(): any[] {
    const summary: { [key: string]: number } = {};
    this.expenses.forEach(exp => {
      summary[exp.category] = (summary[exp.category] || 0) + Number(exp.amount);
    });
    return Object.entries(summary).map(([category, total]) => ({ category, total }));
  }

  private saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.expenses));
  }

  private loadExpenses(): any[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  reset(){
    this.expenses = [];
  }
}
