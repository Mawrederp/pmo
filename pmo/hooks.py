# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "pmo"
app_title = "pmo"
app_publisher = "s"
app_description = "PMO"
app_icon = "s"
app_color = "grey"
app_email = "s"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = "/assets/pmo/css/dhtmlxgantt.css?v=20180322"
# app_include_js = "/assets/pmo/js/pmo.js"

# include js, css files in header of web template
# web_include_css = "/assets/pmo/css/pmo.css"
# web_include_js = "/assets/pmo/js/pmo.js"

# include js in page
# page_js = {"projects-gantt" : "public/js/dhtmlxgantt.js"}

# include js in doctype views
doctype_js = {"Project Gantt" : "public/js/dhtmlxgantt.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "pmo.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "pmo.install.before_install"
# after_install = "pmo.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "pmo.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

scheduler_events = {
	"daily": [
		"pmo.project_services.doctype.project_initiation.project_initiation.payment_schedule_notification",
		"pmo.project_services.doctype.project_initiation.project_initiation.costing_schedule_notification",
		"pmo.project_services.doctype.project_initiation.project_initiation.costing_schedule_notification_expenses"
	]
}
fixtures = [{
        "dt": "Print Format", 
        "filters": []
      }]

# Testing
# -------

# before_tests = "pmo.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "pmo.event.get_events"
# }
