# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectCostingControl(Document):
    def validate(self):
        self.validate_mp()


    def validate_mp(self):
        arr=[]
        for row in self.project_costing_schedule_control:
            if row.pr==1:
                arr.append(row.name)

        if arr and len(arr)>1:
            frappe.throw("You should check one MP")


    def validate_allocation_cost_value(self):
        frappe.msgprint("The amount exceeds the project cost value of Tawari Services")

    def validate_payment_cost_value(self):
        frappe.msgprint("The amount exceeds the project cost value of External Expenses")

    def get_total_resources_allocation_so_far(self):
        total = frappe.db.sql("select sum(allocation_cost_value) from `tabProject Costing Control` where project_name='{0}' ".format(self.project_name))
        if total:
            return total[0][0]
        else:
            return 0

