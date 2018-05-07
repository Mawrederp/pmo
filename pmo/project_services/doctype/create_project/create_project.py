# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class CreateProject(Document):
    def on_submit(self):
        frappe.get_doc({
            "doctype": "Project",
            "project_name": self.project_name
        }).save(ignore_permissions = True)

        frappe.db.commit()

        frappe.get_doc({
            "doctype": "Project Initiation",
            "project_name": self.project_name,
            "project": self.project_name
        }).save(ignore_permissions = True)

        frappe.db.commit()

        frappe.get_doc({
            "doctype": "Projects List",
            "project_name": self.project_name,
            "project": self.project_name
        }).save(ignore_permissions = True)

        frappe.db.commit()

        pp = frappe.get_value("Projects List", filters = {"project_name": self.project_name}, fieldname = "name")

        frappe.msgprint(_("""Project {project} and Projects List have been created: <b><a href="#Form/Projects List/{pp}">{pp}</a></b>""".format(project=self.project_name, pp = pp)))


