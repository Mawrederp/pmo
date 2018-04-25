# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class ProjectQuotation(Document):
    pass


@frappe.whitelist()
def get_basic_salary(employee):
    # my_sql_str = ''
    # emp_sal_str = frappe.db.sql(

    #     """Select rounded_total,start_date from `tabSalary Slip` where employee='{0}' order by start_date desc; """.format(employee), as_dict=True)
    # if emp_sal_str:
    #     for i in range(len(emp_sal_str)):
    #         my_sql_str = frappe.db.sql("Select name from `tabSalary Structure` where is_active='Yes' and name = '{0}'".format(
    #             emp_sal_str[i].parent), as_dict=True)
    #         if my_sql_str:
    #             return emp_sal_str[i].rounded_total

    emp_sal = frappe.db.sql("Select rounded_total from `tabSalary Slip` where employee='{0}' order by start_date desc limit 1".format(employee))
    if emp_sal:
        return emp_sal[0][0]


@frappe.whitelist()
def get_item_price(item):
    myitemprice = frappe.db.sql(
        "Select price_list_rate,currency from `tabItem Price` where item_code = '{0}'".format(item), as_dict=True)
    if myitemprice:
        return myitemprice


