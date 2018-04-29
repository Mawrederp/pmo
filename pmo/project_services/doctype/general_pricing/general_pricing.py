# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class GeneralPricing(Document):
	pass
	# def validate(self):
	# 	doc = frappe.get_doc("Project Quotation")
	# 	row = doc.append("project_quotation_table", {})
	# 	row.total_cost_price = 222
	# 	row.selling_price = 2
	# 	doc.save()
