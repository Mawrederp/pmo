# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import datetime
from frappe.utils import add_days, cint, cstr, flt, getdate, rounded, date_diff, money_in_words, get_first_day, get_last_day, nowdate

class ProjectCostingControl(Document):
    def validate(self):
        self.validate_mp()
        self.employee_percentage()

    def validate_mp(self):
        arr=[]
        for row in self.project_costing_schedule_control:
            if row.pr==1:
                arr.append(row.name)

        if arr and len(arr)>1:
            frappe.throw("You should check one MP")


    def employee_percentage(self):
        for i in self.project_costing_employee:
            count=0
            for row in self.project_costing_employee:
                if i.employee==row.employee:
                    count += row.percentage

            if count!=100:
                frappe.throw("The total percentage of employee {0} should be 100%, it is now {1}% !".format(i.employee,count))

    def validate_allocation_cost_value(self):
        frappe.msgprint("The amount exceeds the project cost value of Tawari Services")

    def validate_payment_cost_value(self):
        frappe.msgprint("The amount exceeds the project cost value of External Expenses")

    def get_total_resources_allocation_so_far(self):
        total = frappe.db.sql("select sum(allocation_cost_value) from `tabProject Costing Control` where project_name='{0}' and type_of_cost='Tawari Services' ".format(self.project_name))
        if total:
            return total[0][0]
        else:
            return 0

    def get_total_expenses_allocation_so_far(self,scope_item):
        total = frappe.db.sql("""select sum(costing.payment_cost_value) from `tabProject Costing Control` costing join `tabProject Costing Schedule` schedule
            on costing.name=schedule.parent where costing.project_name='{0}' and costing.type_of_cost='External Expenses'
            and schedule.scope_item='{1}' and schedule.pr=1 """.format(self.project_name,scope_item))
        if total:
            return total[0][0]
        else:
            return 0

    def get_total_expenses_external_allocation_so_far(self):
        total = frappe.db.sql("""select sum(costing.payment_cost_value) from `tabProject Costing Control` costing join `tabProject Costing Schedule` schedule
            on costing.name=schedule.parent where costing.project_name='{0}' and costing.type_of_cost='External Expenses'
            and schedule.pr=1 """.format(self.project_name))
        if total:
            return total[0][0]
        else:
            return 0


    def get_emp_salary(self,employee,employee_name,company):
        doc = frappe.new_doc("Salary Slip")
        doc.salary_slip_based_on_timesheet="0"
        doc.payroll_frequency= "Monthly"
        doc.start_date=get_first_day(getdate(nowdate()))
        doc.end_date=get_last_day(getdate(nowdate()))
        doc.employee= str(employee)
        doc.employee_name=str('employee name')
        doc.company= company
        doc.posting_date= nowdate()
        
        doc.insert(ignore_permissions=True)


        result = doc.net_pay
        self.net_pay = result
    
        doc.delete()

                
        if result:
            return result
        else:
            return '0'

