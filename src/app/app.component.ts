import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseService } from './expense.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  amount = 0;
  category = '';
  note = '';
  date = new Date().toISOString().substring(0, 10);

  constructor(public expenseService: ExpenseService) {}

  ngOnInit(): void {
    
  }

  addExpense() {
    if (!this.amount || !this.category) return;
    const expense: any = {
      amount: this.amount,
      category: this.category,
      note: this.note,
      date: this.date
    };
    this.expenseService.addExpense(expense);
    this.amount = 0;
    this.category = '';
    this.note = '';
    this.date = new Date().toISOString().substring(0, 10);
  }

  get expenses() {
    return this.expenseService.getExpenses();
  }

  get summary() {
    return this.expenseService.getCategorySummary();
  }

  downloadCSV() {
    const expenses = this.expenseService.getExpenses();
    if (!expenses.length) return;
  
    const headers = ['Date', 'Amount', 'Category', 'Note'];
    const csvRows = [
      headers.join(','), // Header row
      ...expenses.map(e => 
        [e.date, e.amount, e.category, `"${(e.note || '').replace(/"/g, '""')}"`].join(',')
      )
    ];
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  deleteData(){
    if (confirm('Are you sure you want to delete data?')) {
      // User clicked OK
      localStorage.removeItem('daily_expenses');
      this.expenseService.reset();
      // this.summary=[];
    } else {
      // User clicked Cancel
      console.log('Cancelled');
    }
  }

}
