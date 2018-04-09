# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document

class ProjectInitiation(Document):
	
	def on_submit(self):
		frappe.get_doc({
			"doctype": "Project",
			"project_name": self.project_name
		}).save(ignore_permissions = True)

		frappe.db.commit()

		pp = frappe.get_doc({
			"doctype": "Project Planning",
			"project_name": self.project_name
		}).save(ignore_permissions = True)

		frappe.db.commit()

		frappe.msgprint(_("Project {project} and Project Planning {pp} have been created".format(project=self.project_name, pp = pp.name)))

