import json
import frappe
# import frappe.handler
import frappe.client
# from frappe.utils.response import build_response
from frappe import _
# from six.moves.urllib.parse import urlparse, urlencode
from frappe.utils import cint, cstr, date_diff, flt, formatdate, getdate, get_link_to_form, \
	comma_or, get_fullname, add_years, add_months, add_days, nowdate


@frappe.whitelist(allow_guest=True)
def save_tasks(tasks):
	data = json.loads(tasks)
	
	# data = jdata["data"]

	for task in data:
		# return task["doctype"]
		if "doctype" in task:
			if task['doctype'] == "Project":

				project_doc = frappe.get_doc("Project", task["name"])
				

			elif task["doctype"] == "Task":

				task_doc = frappe.get_doc("Project", task["name"])
				return "dd"

		else:
			pass

	# return dumpped_tasks

