# -*- coding: utf-8 -*-
# Copyright (c) 2018, s and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
import json
import datetime
from datetime import date

class ProjectInitiation(Document):
    def validate(self):
        if self.workflow_state == 'Approved by PMO Director':
            if not frappe.db.exists("Project Planning", {"project_name": self.project_name}):
                self.make_project_planning()
                self.validate_emp()
        
        if self.workflow_state:
            if "Rejected" in self.workflow_state:
                self.docstatus = 1
                self.docstatus = 2
            
        # field_array = ["cost","selling_price","risk_contingency", "total_selling_price","profit","markup","margin"]
        # final_totals_list = [0] * 7
        # self.project_financial_detail = []
        
        # for i in range(0,15):
        #     if (((getattr(self, field_array[0]+"_"+str(i) ) == 0) 
        #     and (getattr(self, field_array[1]+"_"+str(i))== 0)
        #     and (getattr(self, field_array[3]+"_"+str(i))== 0))):
        #         pass 
        #     else:
        #         for j in range(len(final_totals_list)):
        #                 if (getattr(self, field_array[j]+"_"+str(i))):
        #                     final_totals_list[j] += float(
        #                         str(getattr(self, field_array[j]+"_"+str(i))))
        #         self.append("project_financial_detail", {"scope_item": getattr(self, "section_name"+"_"+str(i)),
        #                     "cost_price": getattr(self, field_array[0]+"_"+str(i)),
        #                     "selling_price": getattr(self, field_array[1]+"_"+str(i)),
        #                     "additions_value": getattr(self, field_array[2]+"_"+str(i)),
        #                     "final_selling_price": getattr(self, field_array[3]+"_"+str(i)),
        #                     "profit": getattr(self, field_array[4]+"_"+str(i)),
        #                     "markup": getattr(self, field_array[5]+"_"+str(i)),
        #                     "margin": getattr(self, field_array[6]+"_"+str(i)),
        #                     "adjustment": 123
        #                     })
        
        # self.total_cost_price = final_totals_list[0]
        # self.selling_price = final_totals_list[1]
        # self.additions_value = final_totals_list[2]
        # self.total_selling_price = final_totals_list[3]
        # self.profit = final_totals_list[4]
        # self.markup = final_totals_list[5]
        # self.margin = final_totals_list[6]


        for row in self.project_costing_schedule:
        	if row.type_of_cost=='External Expenses' and row.scope_item:
	        	count=0
	        	for i in self.project_costing_schedule:
	        		if i.scope_item==row.scope_item:
		        		count += 1

		        print '************************'
		        print row.no_contracts,count
		        print '************************'
	        	# count = frappe.db.sql("select count(scope_item) from `tabProject Costing Schedule` where scope_item='{0}'".format(row.scope_item))[0][0]
	        	if str(row.no_contracts) != str(count) :
	        		frappe.throw("No. of POs/Contracts must equal project costing schedule inputs for scope item {0}".format(row.scope_item))


            
        # doc = frappe.db.sql("select data from `tabVersion` where ref_doctype='Project Initiation' and docname='{0}' order by creation desc limit 1".format(self.name))
        # if doc:
        #     for i in range(len(json.loads(doc[0][0])['changed'])):
        #         edit_property = json.loads(doc[0][0])['changed'][i][0]
        #         if edit_property=='workflow_state' or edit_property=='overall_project_markup' or edit_property=='overall_project_margin':
        #             pass
        #         else:
        #             self.cur_validate_emp()


    def cur_validate_emp(self):
        if self.project_coordinator:
            if self.project_manager_role:
                if self.senior_project_manager:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProjM+SPM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+ProjM+SPM)"
                else:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProjM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+ProjM)"
            else:
                if self.senior_project_manager:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+SPM+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC+SPM)"
                else:
                    if self.program_manager:
                        self.workflow_state = "Pending(PC+ProgM)"
                    else:
                        self.workflow_state = "Pending(PC)"
        elif self.project_manager_role:
            if self.senior_project_manager:
                if self.program_manager:
                    self.workflow_state = "Pending(ProjM+SPM+ProgM)"
                else:
                    self.workflow_state = "Pending(ProjM+SPM)"
            else:
                if self.program_manager:
                    self.workflow_state = "Pending(ProjM+ProgM)"
                else:
                    self.workflow_state = "Pending(ProjM)"
        elif self.senior_project_manager:
            if self.program_manager:
                self.workflow_state = "Pending(SPM+ProgM)"
            else:
                self.workflow_state = "Pending(SPM)"
        elif self.program_manager:
            self.workflow_state = "Pending(ProgM)"



    def validate_emp(self):
        doc = frappe.get_doc("Project Planning", self.project_name)
        if doc:
            if self.project_coordinator:
                if self.project_manager_role:
                    if self.senior_project_manager:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProjM+SPM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+ProjM+SPM)"
                    else:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProjM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+ProjM)"
                else:
                    if self.senior_project_manager:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+SPM+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC+SPM)"
                    else:
                        if self.program_manager:
                            doc.workflow_state = "Pending(PC+ProgM)"
                        else:
                            doc.workflow_state = "Pending(PC)"
            elif self.project_manager_role:
                if self.senior_project_manager:
                    if self.program_manager:
                        doc.workflow_state = "Pending(ProjM+SPM+ProgM)"
                    else:
                        doc.workflow_state = "Pending(ProjM+SPM)"
                else:
                    if self.program_manager:
                        doc.workflow_state = "Pending(ProjM+ProgM)"
                    else:
                        doc.workflow_state = "Pending(ProjM)"
            elif self.senior_project_manager:
                if self.program_manager:
                    doc.workflow_state = "Pending(SPM+ProgM)"
                else:
                    doc.workflow_state = "Pending(SPM)"
            elif self.program_manager:
                doc.workflow_state = "Pending(ProgM)"

            doc.program_manager = self.program_manager
            doc.senior_project_manager = self.senior_project_manager
            doc.project_manager_role = self.project_manager_role
            doc.project_coordinator = self.project_coordinator

            doc.save(ignore_permissions=True)



    # def validate_emp(self):
    #     if self.get('__islocal'):
    #         if self.project_coordinator:
    #             if self.project_manager:
    #                 if self.senior_project_manager:
    #                     if self.program_manager:
    #                         self.workflow_state = "Pending(PC+ProjM+SPM+ProgM)"
    #                     else:
    #                         self.workflow_state = "Pending(PC+ProjM+SPM)"
    #                 else:
    #                     if self.program_manager:
    #                         self.workflow_state = "Pending(PC+ProjM+ProgM)"
    #                     else:
    #                         self.workflow_state = "Pending(PC+ProjM)"
    #             else:
    #                 if self.senior_project_manager:
    #                     if self.program_manager:
    #                         self.workflow_state = "Pending(PC+SPM+ProgM)"
    #                     else:
    #                         self.workflow_state = "Pending(PC+SPM)"
    #                 else:
    #                     if self.program_manager:
    #                         self.workflow_state = "Pending(PC+ProgM)"
    #                     else:
    #                         self.workflow_state = "Pending(PC)"
    #         elif self.project_manager:
    #             if self.senior_project_manager:
    #                 if self.program_manager:
    #                     self.workflow_state = "Pending(ProjM+SPM+ProgM)"
    #                 else:
    #                     self.workflow_state = "Pending(ProjM+SPM)"
    #             else:
    #                 if self.program_manager:
    #                     self.workflow_state = "Pending(ProjM+ProgM)"
    #                 else:
    #                     self.workflow_state = "Pending(ProjM)"
    #         elif self.senior_project_manager:
    #             if self.program_manager:
    #                 self.workflow_state = "Pending(SPM+ProgM)"
    #             else:
    #                 self.workflow_state = "Pending(SPM)"
    #         elif self.program_manager:
    #             self.workflow_state = "Pending(ProgM)"




    # def on_submit(self):
    #     frappe.get_doc({
    #         "doctype": "Project Planning",
    #         "project_name": self.project_name
    #     }).save(ignore_permissions = True)

    #     frappe.db.commit()

    #     pp = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")

    #     frappe.msgprint(_("""Project Planning have been created: <b><a href="#Form/Project Planning/{pp}">{pp}</a></b>""".format(pp = pp)))

    def make_project_planning(self):
        frappe.get_doc({
            "doctype": "Project Planning",
            "project_name": self.project_name,
            "project": self.project_name,
            "projects_list": self.projects_list
        }).save(ignore_permissions = True)

        frappe.db.commit()

        pp = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")

        frappe.msgprint(_("""Project Planning have been created: <b><a href="#Form/Project Planning/{pp}">{pp}</a></b>""".format(pp = pp)))
    

    def existing_project_planning(self):
        project_name = frappe.get_value("Project Planning", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Planning not exist for this project")


    def remaining_billing_percent_msg(self,remaining_percent):
        if(remaining_percent):
            frappe.msgprint("It is not allowed to enter a billing percentage that is higher than {0}".format(remaining_percent))


    def existing_project_controlling(self):
        project_name = frappe.get_value("Project Implementation Monitoring and Controlling", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Implementation Monitoring and Controlling not exist for this project")


    def existing_project_closure(self):
        project_name = frappe.get_value("Project Closure", filters = {"project_name": self.project_name}, fieldname = "name")
        if project_name:
            return project_name
        else:
            frappe.throw("Project Closure not exist for this project")


    def get_project_cost_value(self,type_of_cost):
        total_cost=0
        if type_of_cost=='Tawari Services':
            total_cost = frappe.db.sql("select sum(cost_price_ts) from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' ".format(self.name))
        elif type_of_cost=='External Expenses':
            total_cost = frappe.db.sql("select sum(total_cost_price) from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' ".format(self.name))            

        if total_cost:
            return total_cost[0][0]


    def get_project_cost_value_item(self,type_of_cost,section_number):
        total_cost=0
        total_cost = frappe.db.sql("select sum(total_cost_price) from `tabItems Details` where parenttype='Project Initiation' and parent='{0}' and parentfield='items_details_{1}' ".format(self.name,section_number))

        if total_cost:
            return total_cost[0][0]


    def validate_po_contract_extimated_cost(self):
        frappe.msgprint("The Po/Contract estimated Cost exceeds the scope item cost value")


def payment_schedule_notification():
    from frappe.core.doctype.communication.email import make
    frappe.flags.sent_mail = None

    projects = frappe.db.sql("select name from `tabProject Initiation`")
    for project_initiation in projects:
        doc = frappe.get_doc('Project Initiation', project_initiation[0] )

        for row in doc.project_payment_schedule:
            content_msg="""
                 Please be advised that the project {0} has a legitimate invoice as the following, please initiate the invoice request:

                    <br>Scope Item: {1}

                    <br>Item’s Value: {2}

                    <br>Billing Percentage (%): {3}

                    <br>Description/When: {4}

                    <br>Total Billing Value: {5}

                    <br>Remaining Billing %: {6}

                    <br>Remaining Billing Value: {7}

                        """.format(row.parent,row.scope_item,row.items_value,row.billing_percentage,row.description_when,row.total_billing_value,row.remaining_billing_percent,row.remaining_billing_value)

            if row.date_period=='Date':
                if row.when==date.today():
                    try:
                        make(subject = "Project Invoice Notification", content=content_msg, recipients='ai.alamri@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        make(subject = "Project Invoice Notification", content=content_msg, recipients='fm.alqarni@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        if doc.project_manager_role:
	                        make(subject = "Project Invoice Notification", content=content_msg, recipients=doc.project_manager_role,
	                            send_email=True, sender="erp@tawari.sa")

                        print 'send email done '
                    except:
                        frappe.msgprint("could not send")

            elif row.date_period=='Period':
                if str(row.from_date) <= str(date.today()) and str(date.today()) <= str(row.to_date):
                    try:
                        make(subject = "Project Invoice Notification", content=content_msg, recipients='ai.alamri@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        make(subject = "Project Invoice Notification", content=content_msg, recipients='fm.alqarni@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        if doc.project_manager_role:
	                        make(subject = "Project Invoice Notification", content=content_msg, recipients=doc.project_manager_role,
	                            send_email=True, sender="erp@tawari.sa")

                        print 'send email done '
                    except:
                        frappe.msgprint("could not send")



def costing_schedule_notification():
    from frappe.core.doctype.communication.email import make
    frappe.flags.sent_mail = None

    projects = frappe.db.sql("select name from `tabProject Initiation`")
    for project_initiation in projects:
        doc = frappe.get_doc('Project Initiation', project_initiation[0] )

        for row in doc.project_costing_schedule:
            content_msg="""
                 Please issue Cost allocation of Tawari Services from the project costing control as follows:

                    <br>Project Name: {0}

                    <br>Project Cost Value: {1}

                    <br>Delivery Date/Period: {2}

                    <br>Description/Comments: {3}

                    <br><br>Please make sure you allocate your resources Cost within the available project cost value.

                        """.format(doc.name,row.project_cost_value,row.delivery_date,row.description_comments)

           
            if row.type_of_cost=='Tawari Services':
                if date.today()==frappe.utils.get_last_day(date.today()):
                    try:
                        make(subject = "Project Costing Notification", content=content_msg, recipients='ai.alamri@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        make(subject = "Project Costing Notification", content=content_msg, recipients='fm.alqarni@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        if doc.project_manager_role:
                            make(subject = "Project Costing Notification", content=content_msg, recipients=doc.project_manager_role,
                                send_email=True, sender="erp@tawari.sa")

                        print 'send email done '
                    except:
                        frappe.msgprint("could not send")

            


def costing_schedule_notification_expenses():
    from frappe.core.doctype.communication.email import make
    frappe.flags.sent_mail = None

    projects = frappe.db.sql("select name from `tabProject Initiation`")
    for project_initiation in projects:
        doc = frappe.get_doc('Project Initiation', project_initiation[0] )

        for row in doc.project_costing_schedule:
            content_msg="""
                 Please issue a purchase request of the {0} project as follows:

                    <br>Type of Cost: {1}

                    <br>Scope Item: {2}

                    <br>Scope Item Cost Value: {3}

                    <br>No. of POs: {4}

                    <br>PO/Contract estimated Cost: {5}

                    <br>Vendore: {6}

                    <br>Delivery Date/Period: {7}

                    <br>Last Date to issue a PR Date/Period: {8}

                        """.format(doc.name,row.type_of_cost,row.scope_item,row.scope_item_cost_value,row.no_contracts,row.po_contract_extimated_cost,row.vendor,row.delivery_date,row.last_date)

           
            if row.type_of_cost=='External Expenses':
                if date.today()==row.last_date:
                    try:
                        make(subject = "Project Costing Notification", content=content_msg, recipients='ai.alamri@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        make(subject = "Project Costing Notification", content=content_msg, recipients='fm.alqarni@tawari.sa',
                            send_email=True, sender="erp@tawari.sa")

                        if doc.project_manager_role:
                            make(subject = "Project Costing Notification", content=content_msg, recipients=doc.project_manager_role,
                                send_email=True, sender="erp@tawari.sa")

                        print 'send email done '
                    except:
                        frappe.msgprint("could not send")



@frappe.whitelist()
def get_project_detail(project, company=None):
    project_dict = frappe.db.sql("""select * from `tabProject Initiation` where name=%s""", (project), as_dict=1)
    if not project_dict:
        frappe.throw("Project {0} not found".format(project))

    project_financial_detail = frappe.db.sql(""" select * from `tabProject Financial Details` where parent=%s """, (project), as_dict=1)
    project_payment_schedule = frappe.db.sql(""" select * from `tabProject Payment Schedule` where parent=%s """, (project), as_dict=1)
    project_costing_schedule = frappe.db.sql(""" select * from `tabProject Costing Schedule` where parent=%s """, (project), as_dict=1)
    stakeholder = frappe.db.sql(""" select * from `tabStakeholder` where parent=%s """, (project), as_dict=1)
    project_major_deliverables = frappe.db.sql(""" select * from `tabProject Major Deliverables` where parent=%s """, (project), as_dict=1)
    project_high_level_risks = frappe.db.sql(""" select * from `tabProject Risk` where parent=%s """, (project), as_dict=1)
    vendor = frappe.db.sql(""" select * from `tabProject Vendor` where parent=%s """, (project), as_dict=1)


    details = project_dict[0]

    return details,project_financial_detail,project_payment_schedule,project_costing_schedule,stakeholder,project_major_deliverables,project_high_level_risks,vendor

