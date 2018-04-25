# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document


class ProjectQuotation(Document):
    def after_insert(self):
        ProjectQuotation.create_general_pricing(self)

    def create_general_pricing(self):

        doc = ""
        exists = False
        items = ["Project Management and Technical Services", "Development Services",
                 "H/W", "S/W", "Man Power", "Support License Renew", "Training", "Expenses"]
        type_array = ["_pmts", "_develop", "_hw", "_sw",
                      "_manpower", "_support", "_training", "_expenses"]
        field_array = ["total_cost_price", "total_selling_price",
                       "total_profit", "total_markup", "total_margin"]

        items_editable = ["Financing",
                          "Commission Of (Sales & P Delivery)", "VAT"]
        backup_editable = []

        totals_risk = [0, 0, 0, 0, 0]
        totals_sums = [0, 0, 0, 0, 0]

        if frappe.db.exists("General Pricing", {"project_q": self.name}):
            exists = True
            gp = frappe.db.sql(
                """Select name from `tabGeneral Pricing` where project_q = '{0}'""".format(self.name))
            doc = frappe.get_doc("General Pricing", gp[0][0])

            for i in range(len(items_editable)):
                row = doc.get("project_quotation", {
                              "items": items_editable[i]})
                if row:
                    backup_editable.append(row[0])

        else:
            doc = frappe.new_doc("General Pricing")

        doc.project_quotation = []
        for i in range(len(items)):
            totals_risk[0] += float(getattr(self,
                                            field_array[0]+type_array[i]))
            doc.append("project_quotation", {"items": items[i],
                                             field_array[0]: getattr(self, field_array[0]+type_array[i]),
                                             field_array[1]: getattr(self, field_array[1]+type_array[i]),
                                             field_array[2]: getattr(self, field_array[2]+type_array[i]),
                                             field_array[3]: getattr(self, field_array[3]+type_array[i]),
                                             field_array[4]: getattr(self, field_array[4]+type_array[i]),
                                             })
        if backup_editable:
            doc.append("project_quotation", {"items": "Risk & contingency",
                                             field_array[0]: totals_risk[0]*0.01,
                                             field_array[1]: int(round(totals_risk[0]*0.01)),
                                             field_array[2]: totals_risk[2],
                                             field_array[3]: totals_risk[3],
                                             field_array[4]: totals_risk[4],
                                             })
            for i in range(len(items_editable)):
                doc.append("project_quotation", backup_editable[i])
        else:
            doc.append("project_quotation", {"items": "Risk & contingency",
                                             field_array[0]: totals_risk[0]*0.01,
                                             field_array[1]: int(round(totals_risk[0]*0.01)),
                                             field_array[2]: totals_risk[2],
                                             field_array[3]: totals_risk[3],
                                             field_array[4]: totals_risk[4],
                                             })
            doc.append("project_quotation", {"items": items_editable[0],
                                             field_array[0]: "0",
                                             field_array[1]: "0",
                                             field_array[2]: "0",
                                             field_array[3]: "0",
                                             field_array[4]: "0",
                                             })
            doc.append("project_quotation", {"items": items_editable[1],
                                             field_array[0]: "0",
                                             field_array[1]: "0",
                                             field_array[2]: "0",
                                             field_array[3]: "0",
                                             field_array[4]: "0",
                                             })
            doc.append("project_quotation", {"items": items_editable[2],
                                             field_array[0]: "0",
                                             field_array[1]: "0",
                                             field_array[2]: "0",
                                             field_array[3]: "0",
                                             field_array[4]: "0",
                                             })

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
    # my_sql_str = ''
    # emp_sal_str = frappe.db.sql(

    #     """Select rounded_total,start_date from `tabSalary Slip` where employee='{0}' order by start_date desc; """.format(employee), as_dict=True)
    # if emp_sal_str:
    #     for i in range(len(emp_sal_str)):
    #         my_sql_str = frappe.db.sql("Select name from `tabSalary Structure` where is_active='Yes' and name = '{0}'".format(
    #             emp_sal_str[i].parent), as_dict=True)
    #         if my_sql_str:
    #             return emp_sal_str[i].rounded_total

    emp_sal = frappe.db.sql(
        "Select rounded_total from `tabSalary Slip` where employee='{0}' order by start_date desc limit 1".format(employee))
    if emp_sal:
        return emp_sal[0][0]


@frappe.whitelist()
def get_item_price(item):
    myitemprice = frappe.db.sql(
        "Select price_list_rate,currency from `tabItem Price` where item_code = '{0}'".format(item), as_dict=True)
    if myitemprice:
        return myitemprice


