# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class ProjectQuotation(Document):
    def before_save(self):
        if(not self.get("__islocal")):
            ProjectQuotation.create_general_pricing(self)

    def after_insert(self):
        ProjectQuotation.create_general_pricing(self)

    def create_general_pricing(self):
        doc = ""
        exists = False
        items = ["Project Management and Technical Services", "Development Services",
                 "H/W", "S/W", "Man Power", "Support License Renew", "Training", "Expenses", "Risk & contingency", "Financing", "Commission Of (Sales & P Delivery)", "VAT"]

        type_array = ["_pmts", "_develop", "_hw", "_sw",
                      "_manpower", "_support", "_training", "_expenses", "_risk_contingency", "_financing", "_commission", "_vat"]
        field_array = ["total_cost_price", "total_selling_price",
                       "total_profit", "total_markup", "total_margin"]
        final_totals_list = [0] * 3

        if frappe.db.exists("General Pricing", {"project_q": self.name}):
            exists = True
            gp = frappe.db.sql(
                """Select name from `tabGeneral Pricing` where project_q = '{0}'""".format(self.name))
            doc = frappe.get_doc("General Pricing", gp[0][0])
        else:
            doc = frappe.new_doc("General Pricing")

        doc.project_quotation = []
        print doc.project_quotation
        for i in range(len(items)):
            for j in range(3):
                if (getattr(self, field_array[j]+type_array[i])):
                    final_totals_list[j] += float(
                        str(getattr(self, field_array[j]+type_array[i])))
            final_totals_list[1] = round(final_totals_list[1])
            x = 0
            if (getattr(self, field_array[1]+type_array[i])):
                x = getattr(self, field_array[1]+type_array[i])
            doc.append("project_quotation", {"items": items[i],
                                             field_array[0]: getattr(self, field_array[0]+type_array[i]),
                                             field_array[1]: round(float(str(x))),
                                             field_array[2]: getattr(self, field_array[2]+type_array[i]),
                                             field_array[3]: getattr(self, field_array[3]+type_array[i]),
                                             field_array[4]: getattr(self, field_array[4]+type_array[i]),
                                             })
        selling_price_risk = 0
        selling_price_financing = 0
        if(getattr(self, field_array[1]+type_array[8])):
            selling_price_risk = float(
                str(getattr(self, field_array[1]+type_array[8])))
        if(getattr(self, field_array[1]+type_array[9])):
            selling_price_financing = float(
                str(getattr(self, field_array[1]+type_array[9])))

        doc.total_cost_price = final_totals_list[0]
        doc.selling_price = final_totals_list[1]
        doc.profit_amount = final_totals_list[2]
        if (final_totals_list[0] and final_totals_list[0] != 0):
            doc.total_markup = (
                final_totals_list[2] / final_totals_list[0])*100
        else:
            doc.total_markup = 0
        if (final_totals_list[1] and final_totals_list[1] != 0):
            doc.total_margin = round(
                (final_totals_list[2] / final_totals_list[1])*100, 1)
        else:
            doc.total_margin = 0
        profit_amount_risk = final_totals_list[2] + \
            selling_price_risk + selling_price_financing
        doc.profit_amount_risk = profit_amount_risk
        if (final_totals_list[0] and final_totals_list[0] != 0):
            doc.total_markup_risk = (
                profit_amount_risk / final_totals_list[0])*100
        else:
            total_markup_risk = 0
        if (final_totals_list[1] and final_totals_list[1] != 0):
            doc.total_margin_risk = round(
                (profit_amount_risk / final_totals_list[1])*100, 1)
        else:
            doc.total_margin_risk = 0

        doc.flags.ignore_permissions = True

        if exists:
            doc.save(ignore_permissions=True)
            frappe.msgprint(
                "<a href='desk#Form/General Pricing/{0}' >{0}</a>".format(doc.name) + " is updated")
        else:
            doc.project_q = self.name
            doc.insert(ignore_permissions=True)
            frappe.msgprint(
                "<a href='desk#Form/General Pricing/{0}' >{0}</a>".format(doc.name) + " is inserted")


@frappe.whitelist()
def get_basic_salary(employee):
    emp_sal = frappe.db.sql(
        "Select rounded_total from `tabSalary Slip` where employee='{0}' order by start_date desc limit 1".format(employee))
    if emp_sal:
        return emp_sal[0][0]

    emp_sal = frappe.db.sql("Select rounded_total from `tabSalary Slip` where employee='{0}' order by start_date desc limit 1".format(employee))
    if emp_sal:
        return emp_sal[0][0]

@frappe.whitelist()
def get_item_price(item):
    myitemprice = frappe.db.sql(
        "Select price_list_rate,currency from `tabItem Price` where item_code = '{0}'".format(item), as_dict=True)
    if myitemprice:
        return myitemprice
