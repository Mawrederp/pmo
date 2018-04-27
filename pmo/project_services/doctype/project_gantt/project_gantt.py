# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt
from __future__ import unicode_literals
import json
import math
# import frappe.handler
import frappe
from frappe.model.document import Document
import frappe.client
# from frappe.utils.response import build_response
from frappe import _
# from six.moves.urllib.parse import urlparse, urlencode
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
	comma_or, get_fullname, add_years, add_months, add_days, nowdate, format_datetime

class ProjectGantt(Document):
	pass


@frappe.whitelist(allow_guest=True)
def save_tasks(tasks, project_name):

	data = json.loads(tasks)
	
	# data = jdata["data"]

	for task in data:
		start_date = formatdate(task["start_date"], "yyyy-MM-dd")
		end_date = formatdate(task["end_date"], "yyyy-MM-dd")
		# return task["doctype"]

		if task['type'] == "project" and task["name"] == project_name:
			# '{0}-{1}-{2}'.format()
			# frappe.throw(str(task["id"]))
			project_doc = frappe.get_doc("Project", task["name"])
			project_doc.update({
				# "percent_complete": task["progress"]*100,
				"project_name": task["text"],
				"expected_start_date": start_date,
				"expected_end_date": end_date
				# "expected_end_date": add_days(getdate(task["start_date"]), task["duration"])
				})
			project_doc.save(ignore_permissions=True)
			frappe.db.commit()

		else:
			if task["parent"] == project_name:
				parent_task = None
			else:
				parent_task = frappe.get_value("Task", filters={"id": task["parent"]}, fieldname="name")

				# task["parent"]
			if "progress" in task:
				progress = round(task["progress"]*100)
			else:
				progress = 0

			task_data = {
				"progress": progress,
				"exp_start_date": start_date,
				"exp_end_date": end_date,
				"act_start_date": start_date,
				"act_end_date": end_date,
				"is_group": task["is_group"],
				"project": project_name,
				"id": task["id"],
				"parent_task": parent_task,
				"subject": task["text"]
				# "expected_end_date": add_days(getdate(task["start_date"]), task["duration"])
				}
			if "name" in task:
				task_doc = frappe.get_doc("Task", task["name"])
			else:
				task_doc = frappe.new_doc("Task")

			task_doc.update(task_data)
			task_doc.save(ignore_permissions=True)
			frappe.db.commit()
		# else:
		# 	pass


@frappe.whitelist(allow_guest=True)
def save_links(links, project_name):

	tasks_links = json.loads(links)

	for link in tasks_links:
		if "name" not in link:
			link_doc = frappe.new_doc("Task Depends On")
			link_doc.update({
				"task": frappe.get_value("Task", filters={"id": link["source"]}, fieldname="name"),
				"parent": frappe.get_value("Task", filters={"id": link["target"]}, fieldname="name"),
				"type": link["type"],
				"id": link["id"],
				"parenttype": "Task",
				"parentfield":depends_on,
				"project": project_name,
				"subject": frappe.get_value("Task", filters={"id": link["source"]}, fieldname="subject")
				})
			link_doc.save(ignore_permissions=True)