# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe
import datetime
from datetime import date
from frappe import _
import json



@frappe.whitelist()
def get_pmo_resources():
    pmo_resources = frappe.db.sql(""" select employee_name,designation,roles from `tabRole Assignment` """)
    return pmo_resources



@frappe.whitelist()
def get_project_managment_assignment(**args):
    extra_condition = get_extra_condition(**args)
    project_emp = frappe.db.sql("""select program_manager,senior_project_manager,project_manager,project_coordinator from `tabProject Management Assignment` where 1=1 {fcond} """ .format(fcond=extra_condition) )
    if extra_condition:
        return project_emp[0]
    else:
        return None


@frappe.whitelist()
def get_project_info(**args):
    extra_condition = get_extra_condition(**args)
    project_info = frappe.db.sql("""select project_name,status,start_date,end_date,project_type from `tabProject Initiation` where 1=1 {fcond} """ .format(fcond=extra_condition) )
    return project_info


@frappe.whitelist()
def get_total_cost(**args):
    extra_condition = get_extra_condition_item_details(**args)
    total_cost = frappe.db.sql("""select scope_item as label ,cost_price as value from `tabProject Financial Details` where 1=1 {fcond} group by scope_item""".format(fcond=extra_condition), as_dict=1 )
    for a in total_cost:
        a["label"] = _(a["label"])
    if not total_cost :
        return [{"label":_("No Data"),"value":0}]
    return total_cost

@frappe.whitelist()
def get_selling_price(**args):
    extra_condition = get_extra_condition_item_details(**args)
    selling_price = frappe.db.sql("""select scope_item as label ,selling_price as value from `tabProject Financial Details` where 1=1 {fcond} group by scope_item""".format(fcond=extra_condition), as_dict=1 )
    for a in selling_price:
        a["label"] = _(a["label"])
    if not selling_price :
        return [{"label":_("No Data"),"value":0}]
    return selling_price

@frappe.whitelist()
def get_contingency(**args):
    extra_condition = get_extra_condition_item_details(**args)
    additions_value = frappe.db.sql("""select scope_item as label ,additions_value as value from `tabProject Financial Details` where 1=1 {fcond} group by scope_item""".format(fcond=extra_condition), as_dict=1 )
    for a in additions_value:
        a["label"] = _(a["label"])
    if not additions_value :
        return [{"label":_("No Data"),"value":0}]
    return additions_value

@frappe.whitelist()
def get_final_selling_price(**args):
    extra_condition = get_extra_condition_item_details(**args)
    final_selling_price = frappe.db.sql("""select scope_item as label ,final_selling_price as value from `tabProject Financial Details` where 1=1 {fcond} group by scope_item""".format(fcond=extra_condition), as_dict=1 )
    for a in final_selling_price:
        a["label"] = _(a["label"])
    if not final_selling_price :
        return [{"label":_("No Data"),"value":0}]
    return final_selling_price


# @frappe.whitelist()
# def get_billing(**args):
#   extra_condition = get_extra_condition_item_details(**args)

#   billings_list = frappe.db.sql("""select `when` as d , total_billing_value as billing from `tabProject Payment Schedule` where 1=1 {fcond} group by `when` """.format(fcond=extra_condition), as_dict=1 )
#   for a in billings_list:
#       a["d"] = _(a["d"])
#   if not billings_list :
#       return [{"d":"1-1-2018","billing":0}]
#   return billings_list



@frappe.whitelist()
def get_billing(**args):
    data = []
    extra_condition = get_extra_condition_item_details(**args)

    items = frappe.db.sql_list("""select scope_item from `tabProject Payment Schedule` where 1=1 {fcond} group by scope_item """.format(fcond=extra_condition))
    total_billed = frappe.db.sql("""select scope_item,sum(total_billing_value) from `tabProject Payment Schedule` where 1=1 and billing_status=1 {fcond} group by scope_item """.format(fcond=extra_condition), as_dict=1 )
    total_item_price = frappe.db.sql("""select scope_item,sum(total_billing_value) from `tabProject Payment Schedule` where 1=1 {fcond} group by scope_item """.format(fcond=extra_condition), as_dict=1 )

    for item in items:
        data.append({ 'y': item, 'a': 0,  'b': 0})

    for billed in total_billed:
        for d in data:
            if d['y']==billed['scope_item']:
                d['a']=billed['sum(total_billing_value)']


    for total in total_item_price:
        for d in data:
            if d['y']==total['scope_item']:

                if d['a']==0:
                    d['b']=total['sum(total_billing_value)']
                else:
                    d['b']=total['sum(total_billing_value)']-d['a']

    return data



@frappe.whitelist()
def get_project_finance(**args):
    sections=[]
    items=[]
    cost_project=[]
    selling_price_project=[]
    profit_project=[]
    risk_contingency_project=[]
    total_selling_price_project=[]

    extra_condition = get_extra_condition(**args)
    extra_condition_item = get_extra_condition_item_details(**args)
    for section in range(16):
        section_name = frappe.db.sql("""select section_name_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )
        if section_name[0][0]:
            cost = frappe.db.sql("""select cost_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )
            selling_price = frappe.db.sql("""select selling_price_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )
            profit = frappe.db.sql("""select profit_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )
            risk_contingency = frappe.db.sql("""select risk_contingency_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )
            total_selling_price = frappe.db.sql("""select total_selling_price_{section} from `tabProject Initiation` where 1=1 {fcond} """ .format(section=section,fcond=extra_condition) )

            item_detail = frappe.db.sql("""select item_name,total_cost,selling_price,profit,contingency,final_selling_price from `tabItems Details` where 1=1 and section_name='{section_name}' {fcond} """ .format(section_name=section_name[0][0],fcond=extra_condition_item) )

            sections.append(section_name[0][0])
            cost_project.append(cost[0][0])
            selling_price_project.append(selling_price[0][0])
            profit_project.append(profit[0][0])
            risk_contingency_project.append(risk_contingency[0][0])
            total_selling_price_project.append(total_selling_price[0][0])
            items.append(item_detail)


    if extra_condition:
        return sections,items,cost_project,selling_price_project,profit_project,risk_contingency_project,total_selling_price_project
    else:
        return None



def get_extra_condition(**args):
    extra_condition = ""
    if args:
        for key, value in args.items():
            print("{} is {}".format(key,value))
            if key == "args":
                data = json.loads(value)
                if data != {}:
                    if data["project"] and data["project"]!="":
                        extra_condition += " and project_name = '{project}' ".format(project=data["project"])
    return extra_condition




def get_extra_condition_item_details(**args):
    extra_condition = ""
    if args:
        for key, value in args.items():
            print("{} is {}".format(key,value))
            if key == "args":
                data = json.loads(value)
                if data != {}:
                    if data["project"] and data["project"]!="":
                        extra_condition += " and parent = '{project}' ".format(project=data["project"])
    return extra_condition



