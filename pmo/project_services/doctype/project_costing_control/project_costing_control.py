# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ProjectCostingControl(Document):
    def validate_allocation_cost_value(self):
        frappe.msgprint("The amount exceeds the project cost value of Tawari Services")
