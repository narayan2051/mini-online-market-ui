import AdBsConverter from "ad-bs-converter";
import { BSToAD } from "bikram-sambat-js";

/* date must be in the format: 2076-10-10 or 2019-10-13.
By default, this utility assumes date is in the BS format. Eg: 2070-10-19.
If you are passing AD date in the date value, please specify dateType "AD" as a param.
*/

export const DateUtils = {
  getAdDateFromBs(date) {
    return BSToAD(date);
  },
  getDateMilliseconds(date, dateType) {
    dateType = dateType || "BS";
    if (dateType === "BS") {
      date = BSToAD(date);
    }
    return new Date(date).getTime();
  },
  getDateFromMilliseconds(dateInMills, dateType, showTime) {
    showTime = showTime || false;
    dateType = dateType || "BS";

    // initialize new Date object
    var dateObject = new Date(dateInMills);
    // year as 4 digits (YYYY)
    var year = dateObject.getFullYear();
    // month as 2 digits (MM)
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    // date as 2 digits (DD)
    var date = ("0" + dateObject.getDate()).slice(-2);
    // hours as 2 digits (hh)
    var hours = ("0" + dateObject.getHours()).slice(-2);
    // minutes as 2 digits (mm)
    var minutes = ("0" + dateObject.getMinutes()).slice(-2);
    // seconds as 2 digits (ss)
    var seconds = ("0" + dateObject.getSeconds()).slice(-2);
    var yyMmDd = `${year}/${month}/${date}`;
    var hhMmSs = `${hours}:${minutes}:${seconds}`;
    if (dateType !== "AD") {
      var adDate = AdBsConverter.ad2bs(yyMmDd);
      yyMmDd = adDate.en.year + "-" + adDate.en.month + "-" + adDate.en.day
    }
    return `${yyMmDd}${showTime ? `${hhMmSs}` : ""}`
  },
  getSeparatedDateFromMilliseconds(dateInMills) {
    let splittedDate = ["-", "-", "-"];
    if (dateInMills) {
      splittedDate = this.getDateFromMilliseconds(dateInMills).split("-");
    }
    return {
      day: splittedDate[2],
      month: splittedDate[1],
      year: splittedDate[0]
    }
  },
  getSeparatedDateFromBsDate(BsDate) {
    let splittedDate = ["-", "-", "-"];
    if (BsDate) {
      splittedDate = BsDate.split("-");
    }
    return {
      day: splittedDate[2],
      month: splittedDate[1],
      year: splittedDate[0]
    }
  },
  // date must be BS date
  getDaysBeforeBSDate(daysBefore, date) {
    date = date ? new Date(DateUtils.getAdDateFromBs(date)) : new Date();
    date.setDate(date.getDate() - daysBefore);
    return DateUtils.getDateFromMilliseconds(date);
  },
  // date must be BS date
  getDaysAfterBSDate(daysAfter, date) {
    date = date ? new Date(DateUtils.getAdDateFromBs(date)) : new Date();
    date.setDate(date.getDate() + daysAfter);
    return DateUtils.getDateFromMilliseconds(date);
  },

  // date must be BS date
  // This will return date only by incrementing month. It is not validated whether the returned month have that day in the month or not.
  getMonthsAfterBSDate(afterMonth, date) {
    date = date || DateUtils.getDateFromMilliseconds(new Date().getTime());
    let separatedDate = DateUtils.getSeparatedDateFromBsDate(date);
    let newMonth = parseInt(separatedDate.month) + afterMonth;
    let newMonthPrefix = newMonth.toString().length === 1 ? "0" : ""; // This is to attach "0" before the month if it is a single integer like 01,07,etc.
    if (newMonth <= 12) {
      return separatedDate.year + "-" + newMonthPrefix + "" + newMonth + "-" + separatedDate.day;
    } else {
      let year = parseInt(separatedDate.year) + 1;
      newMonth = newMonth - 12;
      return year + "-" + newMonthPrefix + "" + newMonth + "-" + separatedDate.day;
    }
  },
  getDayNameFromMilliseconds(dateInMills) {
    switch (new Date(dateInMills).getDay()) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "";
    }
  },
  getMonthNameFromMilliseconds(dateInMills) {
    switch (DateUtils.getDateFromMilliseconds(dateInMills).split("-")[1]) {
      case "01":
        return "बैशाख";
      case "02":
        return "जेठ";
      case "03":
        return "असार";
      case "04":
        return "श्रावण";
      case "05":
        return "भदौ";
      case "06":
        return "आश्विन";
      case "07":
        return "कार्तिक";
      case "08":
        return "मंसिर";
      case "09":
        return "पुष";
      case "10":
        return "माघ";
      case "11":
        return "फाल्गुन";
      case "12":
        return "चैत्र";
      default:
        return "";
    }
  },

  getFiscalYearFromDate(date) {
    // date must be string. Eg.: 2076-10-10
    let year = date.split("-")[0];
    let month = parseInt(date.split("-")[1]);
    let fiscalYearPrefix = year.slice(-2).split("")[0] === "0" ? "0" : ""; // This is to attach "0" before the fiscal year if it is a single integer like 01,07,etc.

    return month <= 3 ? (parseInt(year) - 1) + "_" + year.slice(-2) : year + "_" + fiscalYearPrefix + "" + (parseInt(year.slice(-2)) + 1);
  },
  getDateWithFirstDayOfYear(date) {
    date = date || DateUtils.getDateFromMilliseconds(new Date().getTime());
    let year = date.split("-")[0];
    return year + "-01-01";
  },
  getNepaliMonthIndexByFiscalYear(month) {
    month = month || this.getSeparatedDateFromMilliseconds(Date.now()).month;
    switch (Number(month)) {
      case 1:
        return "BAISHAKH";
      case 2:
        return "JESTHA";
      case 3:
        return "ASAR";
      case 4:
        return "SHRAWAN";
      case 5:
        return "BHADAU";
      case 6:
        return "ASWIN";
      case 7:
        return "KARTIK";
      case 8:
        return "MANSIR";
      case 9:
        return "POUSH";
      case 10:
        return "MAGH";
      case 11:
        return "FALGUN";
      case 12:
        return "CHAITRA";
      default:
        return "";
    }
  },
  getStartDateOfCurrentFiscalYear() {
    return this.getFiscalYearFromDate(this.getDateFromMilliseconds(Date.now())).split("_")[0] + "-04-01";
  },
  getCurrentMonthFirstAndLastDate() {
    // TODO: Prastav - Replace ad-bs-converter with bikram-sambat-js
    let currentDate = this.getDateFromMilliseconds(Date.now());
    let currentYear = this.getSeparatedDateFromBsDate(currentDate).year;
    let currentMonth = this.getSeparatedDateFromBsDate(currentDate).month;
    let lastDate;
    if (currentMonth !== "12") {
      lastDate = this.getDaysBeforeBSDate(1, (currentYear + "-" + (Number(currentMonth) + 1) + "-01"))
    } else {
      let nextYearFirstDateInMillisecond = this.getDateMilliseconds(((Number(currentYear) + 1) + "-01-01"));
      let currentYearLastDateInMillis = nextYearFirstDateInMillisecond - 86400000;
      let currentYearLastDate = new Date(currentYearLastDateInMillis);
      let year = currentYearLastDate.getFullYear();
      let month = ("0" + (currentYearLastDate.getMonth() + 1)).slice(-2);
      let date = ("0" + currentYearLastDate.getDate()).slice(-2);
      let yyMmDd = `${year}/${month}/${date}`;
      let equivalentBSDate = AdBsConverter.ad2bs(yyMmDd);
      lastDate = equivalentBSDate.en.year + "-" + equivalentBSDate.en.month + "-" + equivalentBSDate.en.day
    }
    return {
      firstDay: currentYear + "-" + currentMonth + "-" + "01",
      lastDay: lastDate
    }
  }
};
