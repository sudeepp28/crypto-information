
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CurrencyService } from '../services/currency.service';
@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {

  bannerData: any = [];
  currency : string = "INR"
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap']; //from API field_names
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private api: ApiService, private router : Router,private currencyService:CurrencyService) { }

  ngOnInit(): void {
    // this.getAllData();
    // this.getBannerData();
    this.currencyService.getCurrency() //inject currencyService,subscribe getter 
    .subscribe((val: string)=>{
      this.currency=val
      console.log("this.currency",this.currency);
      this.getAllData();
      this.getBannerData();
    })
  }
  getBannerData() {
    this.api.getTrendingCurrency(this.currency)
      .subscribe(res => {
        console.log("getBannerData",res);
        this.bannerData = res;
      })
  }
  getAllData() { //for table data
    this.api.getCurrency(this.currency)
      .subscribe(res => {
        console.log("getAllData",res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoDetails(row: any) {
    this.router.navigate(['coin-detail',row.id]) // navigate to coin-detail/:id
  }

}