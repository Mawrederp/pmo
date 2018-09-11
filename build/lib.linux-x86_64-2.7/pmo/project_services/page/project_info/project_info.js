frappe.pages['project-info'].on_page_load = function(wrapper) {
	var me = this;
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Project Information',
		single_column: true
	});

	page.main.html(frappe.render_template("project_info", {}));
	var project = frappe.ui.form.make_control({
		parent: page.main.find(".project"),
		df: {
			fieldtype: "Link",
			options: "Project",
			fieldname: "project",
			change: function(){
				page.main.find(".frappe-list").html("");

				$(".project-details").css("display","block")
				
				show_project_info(project.get_value(), me);
				$(".project-details .row .project-phases .tab .inititaion").click(function(){
				    show_project_info(project.get_value(), me);
				});
				$(".project-details .row .project-phases .tab .planning").click(function(){
				    show_project_info_planning(project.get_value(), me);
				});
				$(".project-details .row .project-phases .tab .controlling").click(function(){
				    show_project_info_controlling(project.get_value(), me);
				});
				$(".project-details .row .project-phases .tab .closure").click(function(){
				    show_project_info_closure(project.get_value(), me);
				});

			}
		},
		only_input: true,
	});
	project.refresh();


}



var show_project_info = function(project, me){
	frappe.call({
		"method": "pmo.project_services.doctype.project_initiation.project_initiation.get_project_detail",
		args: {
			project: project
		},
		callback: function (r) {
			var data = r.message[0];
			var data1 = r.message[1];
			var data2 = r.message[2];
			var data3 = r.message[3];
			var data4 = r.message[4];
			var data5 = r.message[5];
			var data6 = r.message[6];
			var data7 = r.message[7];
			
			var details = "";
			console.log(r.message[1].length)

			details += "<h4>GENERAL INFORMATION</h4><br>";
			if(data.status) details += "<br><b>Status :</b> " + data.status;
			if(data.project_type) details += "<br><b>Project Type :</b> " + data.project_type;
			if(data.is_active) details += "<br><b>Is Active :</b> " + data.is_active;
			if(data.project_sponsor) details += "<br><b>Project Sponsor :</b> " + data.project_sponsor;
			if(data.project_owner) details += "<br><b>Project Owner :</b> " + data.project_owner;
			if(data.project_manager) details += "<br><b>Project Manager :</b> " + data.project_manager;
			if(data.start_date) details += "<br><b>Start Date :</b> " + data.start_date;
			if(data.end_date) details += "<br><b>End Date :</b> " + data.end_date;
			if(data.priority) details += "<br><b>Priority :</b> " + data.priority;
			if(data.project_sponsor_name) details += "<br><b>Project Sponsor Name :</b> " + data.project_sponsor_name;
			if(data.project_owner_name) details += "<br><b>Project Owner Name :</b> " + data.project_owner_name;
			if(data.project_manager_name) details += "<br><b>Project Manager Name :</b> " + data.project_manager_name;
			details += "<br><hr><h4>CUSTOMER DETAILS</h4><br>";
			if(data.account) details += "<br><b>Account :</b> " + data.account;
			if(data.customer) details += "<br><b>Customer :</b> " + data.customer;
			if(data.employee) details += "<br><b>Employee :</b> " + data.employee;
			if(data.end_users) details += "<br><b>End Users :</b> " + data.end_users;
			if(data.concerned_department) details += "<br><b>Concerned Department :</b> " + data.concerned_department;
			if(data.customer_project_manager) details += "<br><b>Customer Project Manager :</b> " + data.customer_project_manager;
			if(data.customer_project_sponsor) details += "<br><b>Customer Project Sponsor :</b> " + data.customer_project_sponsor;
			if(data.customer_project_owner) details += "<br><b>Customer Project Owner :</b> " + data.customer_project_owner;
			if(data.po_number) details += "<br><b>P.O Number :</b> " + data.po_number;
			if(data.po_date) details += "<br><b>P.O Date :</b> " + data.po_date;
			if(data.customer_department) details += "<br><b>Customer Department :</b> " + data.customer_department;
			details += "<br><hr><h4>PROJECT FINANCIAL DETAILS</h4><br>";

			if (r.message[1].length>0){
				details += "<table class=project_finance_details><tr><th>Scope Item</th><th>Selling price</th><th>Additions Value</th><th>Addition Items</th><th>Cost Price</th><th>Final Selling Price</th></tr>";
				for(var i=0;i<r.message[1].length;i++){
					details += "<tr><td>"+data1[i].scope_item+"</td><td>"+data1[i].selling_price+"</td><td>"+data1[i].additions_value+"</td><td>"+data1[i].addition_items+"</td><td>"+data1[i].cost_price+"</td><td>"+data1[i].final_selling_price+"</td>";	
				}
				details += "</table>";
			}
			
			if(data.total_cost_price) details += "<br><b>Total Cost Price :</b> " + data.total_cost_price;
			if(data.total_final_selling_price) details += "<br><b>Total Final Selling Price :</b> " + data.total_final_selling_price;
			if(data.overall_project_profit) details += "<br><b>Overall Project Profit :</b> " + data.overall_project_profit;
			if(data.overall_project_markup) details += "<br><b>Overall Project Markup % :</b> " + data.overall_project_markup;
			if(data.overall_project_margin) details += "<br><b>Overall Project Margin % :</b> " + data.overall_project_margin;
			if(data.value_cost_center) details += "<br><b>Cost Center :</b> " + data.value_cost_center;
			if(data.default_warehouse) details += "<br><b>Default Warehouse :</b> " + data.default_warehouse;
			details += "<br><hr><h4>PROJECT PAYMENT SCHEDULE</h4><br>";

			if (r.message[2].length>0){
				details += "<table class=project_finance_details><tr><th>Scope Item</th><th>Date/Period</th><th>From Date</th><th>To Date</th><th>Items Value</th><th>Billing Value </th><th>Billing Percentage (%)</th><th>When</th></tr>";
				for(var i=0;i<r.message[2].length;i++){
					details += "<tr><td>"+data2[i].scope_item+"</td><td>"+data2[i].date_period+"</td><td>"+data2[i].from_date+"</td><td>"+data2[i].to_date+"</td><td>"+data2[i].items_value+"</td><td>"+data2[i].billing_value+"</td><td>"+data2[i].billing_percentage+"</td><td>"+data2[i].when+"</td>";	
				}
				details += "</table>";
			}

			if(data.total_billing) details += "<br><b>Total Billing Value :</b> " + data.total_billing;
			details += "<br><hr><h4>PROJECT COSTING SCHEDULE</h4><br>";

			if (r.message[3].length>0){
				details += "<table class=project_finance_details><tr><th>Scope Item</th><th>Items Cost Price</th><th>Cost Value Percentage %</th><th>Cost Value</th><th>Recurrence</th><th>Vendor</th><th>Procurement Type</th><th>Comments</th></tr>";
				for(var i=0;i<r.message[3].length;i++){
					details += "<tr><td>"+data3[i].scope_item+"</td><td>"+data3[i].items_cost_price+"</td><td>"+data3[i].cost_value_percentage+"</td><td>"+data3[i].cost_value+"</td><td>"+data3[i].recurrence+"</td><td>"+data3[i].vendor+"</td><td>"+data3[i].procurement_type+"</td><td>"+data3[i].comments+"</td>";	
				}
				details += "</table>";
			}

			if(data.total_cost_value) details += "<br><b>Total Cost Value :</b> " + data.total_cost_value;
			details += "<br><hr><h4>Project Charter</h4><br>";

			if(data.project) details += "<br><b>Project :</b> " + data.project;
			if(data.project_manager_ch) details += "<br><b>Project Manager :</b> " + data.project_manager_ch;
			if(data.expected_start_date) details += "<br><b>Expected Start Date :</b> " + data.expected_start_date;
			if(data.expected_end_date) details += "<br><b>Expected End Date :</b> " + data.expected_end_date;
			if(data.project_sponsor_ch) details += "<br><b>Project Sponsor :</b> " + data.project_sponsor_ch;
			if(data.project_owner_ch) details += "<br><b>Project Owner :</b> " + data.project_owner_ch;
			if(data.project_managr_ch) details += "<br><b>Project Manager :</b> " + data.project_managr_ch;
			if(data.project_sponsor_name_ch) details += "<br><b>Project Sponsor Name :</b> " + data.project_sponsor_name_ch;
			if(data.project_owner_name_ch) details += "<br><b>Project Owner Name :</b> " + data.project_owner_name_ch;
			if(data.project_manager_name_ch) details += "<br><b>Project Manager Name :</b> " + data.project_manager_name_ch;
			if(data.account_ch) details += "<br><b>Account :</b> " + data.account_ch;
			if(data.customer_ch) details += "<br><b>Customer :</b> " + data.customer_ch;
			if(data.customer_project_manager_ch) details += "<br><b>Customer Project Manager :</b> " + data.customer_project_manager_ch;
			if(data.customer_project_sponsor_ch) details += "<br><b>Customer Project Sponsor :</b> " + data.customer_project_sponsor_ch;
			if(data.customer_project_owner_ch) details += "<br><b>Customer Project Owner :</b> " + data.customer_project_owner_ch;
			if(data.employee_ch) details += "<br><b>Employee :</b> " + data.employee_ch;
			if(data.end_users_ch) details += "<br><b>End Users :</b> " + data.end_users_ch;
			if(data.concerned_department_ch) details += "<br><b>Concerned Department :</b> " + data.concerned_department_ch;
			if(data.po_number_ch) details += "<br><b>P.O Number :</b> " + data.po_number_ch;
			if(data.po_date_ch) details += "<br><b>P.O Date :</b> " + data.po_date_ch;
			if(data.customer_department_ch) details += "<br><b>Customer Department :</b> " + data.customer_department_ch;
			details += "<br><h5>Stakeholder</h5><br>";

			if (r.message[4].length>0){
				details += "<table class=project_finance_details><tr><th>Name</th><th>Party</th><th>Department / Section</th><th>Contact info (Mobile number/e-mail)</th><th>Role</th><th>Responsibilities in the Project</th><th>Influence (1-5)</th></tr>";
				for(var i=0;i<r.message[4].length;i++){
					details += "<tr><td>"+data4[i].name1+"</td><td>"+data4[i].party+"</td><td>"+data4[i].department+"</td><td>"+data4[i].mobile_or_email+"</td><td>"+data4[i].role+"</td><td>"+data4[i].responsibilities_in_the_project+"</td><td>"+data4[i].influence+"</td>";	
				}
				details += "</table>";
			}

			if(data.related_projects) details += "<br><b>Related Projects :</b> " + data.related_projects;
			if(data.business_requirements) details += "<br><b>Project High level Description/ Business Requirements :</b> " + data.business_requirements;
			if(data.project_objective) details += "<br><b>Project Objective /Value :</b> " + data.project_objective;
			if(data.scope) details += "<br><b>Scope :</b> " + data.scope;
			if(data.scope_exclusions) details += "<br><b>Scope Exclusions :</b> " + data.scope_exclusions;

			if (r.message[5].length>0){
				details += "<table class=project_finance_details><tr><th>Major Deliverable</th></tr>";
				for(var i=0;i<r.message[5].length;i++){
					details += "<tr><td>"+data5[i].major_deliverable+"</td>";	
				}
				details += "</table>";
			}

			if(data.project_assumptions) details += "<br><b>Project Assumptions :</b> " + data.project_assumptions;

			if (r.message[6].length>0){
				details += "<table class=project_finance_details><tr><th>Risk</th><th>Responsible</th><th>Likelihood</th><th>Risk Mitigation</th><th>Impact</th><th>Closing Date</th><th>Is Issue</th><th>Status</th></tr>";
				for(var i=0;i<r.message[6].length;i++){
					details += "<tr><td>"+data6[i].risk+"</td><td>"+data6[i].responsible+"</td><td>"+data6[i].likelihood+"</td><td>"+data6[i].risk_mitigation+"</td><td>"+data6[i].impact+"</td><td>"+data6[i].closing_date+"</td><td>"+data6[i].is_issue+"</td><td>"+data6[i].status+"</td>";	
				}
				details += "</table>";
			}
			details += "<br>";
			if (r.message[7].length>0){
				details += "<table class=project_finance_details><tr><th>Supplier</th></tr>";
				for(var i=0;i<r.message[7].length;i++){
					details += "<tr><td>"+data7[i].supplier+"</td>";	
				}
				details += "</table>";
			}

			if(data.overall_project_budget) details += "<br><b>Overall Project Budget :</b> " + data.overall_project_budget;
			
			details += "<br><br><br><br>"
			if(details){
				details = "<div style='font-size:13px;' align='center'></br><b class='text-muted'>Project Initiation Details</b>" + details + "</div>";
			}
			
			$('.here').empty();
			$('.here').append(details);

		}
	});
};






var show_project_info_planning = function(project, me){
	frappe.call({
		"method": "pmo.project_services.doctype.project_planning.project_planning.get_project_detail_planning",
		args: {
			project: project
		},
		callback: function (r) {
			var data = r.message[0];
			var data1 = r.message[1];
			var data2 = r.message[2];
			
			var details = "";

			details += "<h4>PROJECT SCHEDULE</h4><br>";
			if(data.project_name) details += "<br><b>Project Name :</b> " + data.project_name;
			if(data.status_planning) details += "<br><b>Status :</b> " + data.status_planning;
			details += "<br><hr><h4>PROJECT MANAGEMENT PLAN (PMP)</h4><br>";
			if(data.project_management_plan_details) details += "<br><b>Details :</b> " + data.project_management_plan_details;
			details += "<br><hr><h4>SCOPE OF WORK (SOW)</h4><br>";
			if(data.scope_of_work_details) details += "<br><b>Details :</b> " + data.scope_of_work_details;
			details += "<br><hr><h4>QUALITY MANAGEMENT PLAN (QMP)</h4><br>";
			if(data.quality_management_plan_details) details += "<br><b>Details :</b> " + data.quality_management_plan_details;
			details += "<br><hr><h4>RISKS REGISTER</h4><br>";

			if (r.message[1].length>0){
				details += "<table class=project_finance_details><tr><th>Category</th><th>Risk Title</th><th>Risk description</th><th>Date identified</th><th>Risk proximity date</th><th>Expiry date</th></tr>";
				for(var i=0;i<r.message[1].length;i++){
					details += "<tr><td>"+data1[i].category+"</td><td>"+data1[i].risk_title+"</td><td>"+data1[i].risk_description+"</td><td>"+data1[i].date_identified+"</td><td>"+data1[i].risk_proximity_date+"</td><td>"+data1[i].expiry_date+"</td>";
				}
				details += "</table>";
			}

			details += "<br><hr><h4>ROLES AND RESPONSIBILITIES</h4><br>";

			if (r.message[2].length>0){
				details += "<table class=project_finance_details><tr><th>Name</th><th>Party</th><th>Project Role</th><th>Deliverables Leading</th><th>Core/ Extended Team</th><th>% Assigned</th></tr>";
				for(var i=0;i<r.message[2].length;i++){
					details += "<tr><td>"+data2[i].name1+"</td><td>"+data2[i].party+"</td><td>"+data2[i].project_role+"</td><td>"+data2[i].deliverables_leading+"</td><td>"+data2[i].core_extended_team+"</td><td>"+data2[i].assigned+"</td>";
				}
				details += "</table>";
			}

			details += "<br><hr><h4>PROJECT ORGANIZATIONAL STRUCTURE</h4><br>";

			details += "<table class=project_finance_details><tr><th>Roles</th><th>The Client Name</th><th>Tawari</th><th>The Partner Name</th></tr>";
			
			details += "<tr><td>Steering Committee</td><td>"+data.client_steering_name+"</td><td>"+data.tawari_steering_name+"</td><td>"+data.partner_steering_name+"</td></tr>";
			details += "<tr><td>Project Ownership</td><td>"+data.client_ownership_name+"</td><td>"+data.tawari_ownership_name+"</td><td>"+data.partner_ownership_name+"</td></tr>";
			details += "<tr><td>Project Management</td><td>"+data.client_management_name+"</td><td>"+data.tawari_management_name+"</td><td>"+data.partner_management_name+"</td></tr>";
			details += "<tr><td>Technical management</td><td>"+data.client_technical_name+"</td><td>"+data.tawari_technical_name+"</td><td>"+data.partner_technical_name+"</td></tr></table>";

			details += "<br><hr><h4>COMMUNICATION MANAGEMENT PLAN</h4><br>";
			if(data.communication_details) details += "<br><b>Details :</b> " + data.communication_details;

			details += "<br><br><br><br>"
			if(details){
				details = "<div style='font-size:13px;' align='center'></br><b class='text-muted'>Project Planning Details</b>" + details + "</div>";
			}
			
			$('.here').empty();
			$('.here').append(details);

		}
	});
};





var show_project_info_controlling = function(project, me){
	frappe.call({
		"method": "pmo.project_services.doctype.project_implementation_monitoring_and_controlling.project_implementation_monitoring_and_controlling.get_project_detail_controlling",
		args: {
			project: project
		},
		callback: function (r) {
			var data = r.message[0];
			var data1 = r.message[1];
			var data2 = r.message[2];
			
			var details = "";

			details += "<h4>CURRENT PROJECT SCHEDULE</h4><br>";
			if(data.project_name) details += "<br><b>Project Name :</b> " + data.project_name;
			if(data.control_status) details += "<br><b>Status :</b> " + data.control_status;
			details += "<br><hr><h4>PREVIOUS PROJECT SCHEDULES</h4><br>";
			details += "<br><hr><h4>CHANGE REQUEST</h4><br>";

			if (r.message[1].length>0){
				details += "<table class=project_finance_details><tr><th>Change Request Number</th><th>Date Raised</th><th>Requested by</th><th>Priority</th><th>Raised by</th><th>Urgency</th></tr>";
				for(var i=0;i<r.message[1].length;i++){
					details += "<tr><td>"+data1[i].change_request_number+"</td><td>"+data1[i].date_raised+"</td><td>"+data1[i].requested_by+"</td><td>"+data1[i].priority+"</td><td>"+data1[i].raised_by+"</td><td>"+data1[i].urgency+"</td>";
				}
				details += "</table>";
			}

			details += "<br><hr><h4>PROJECT ISSUES SUMMARY</h4><br>";
			
			if (r.message[2].length>0){
				details += "<table class=project_finance_details><tr><th>Priority</th><th>Issue Description</th><th>Impacted</th><th>Action Steps</th></tr>";
				for(var i=0;i<r.message[2].length;i++){
					details += "<tr><td>"+data2[i].priority+"</td><td>"+data2[i].issue_description+"</td><td>"+data2[i].impacted+"</td><td>"+data2[i].action_steps+"</td>";
				}
				details += "</table>";
			}
			details += "<br><br><br><br>"
			if(details){
				details = "<div style='font-size:13px;' align='center'></br><b class='text-muted'>Project Implementation Monitoring and Controlling Details</b>" + details + "</div>";
			}
			
			$('.here').empty();
			$('.here').append(details);

		}
	});
};



var show_project_info_closure = function(project, me){
	frappe.call({
		"method": "pmo.project_services.doctype.project_closure.project_closure.get_project_detail_closure",
		args: {
			project: project
		},
		callback: function (r) {
			var data = r.message;
			
			var details = "";

			details += "<h4>CLOSURE</h4><br>";
			if(data.project_name) details += "<br><b>Project Name :</b> " + data.project_name;
			if(data.closure_status) details += "<br><b>Status :</b> " + data.closure_status;
			details += "<br><hr><h4>PROJECT INFORMATION</h4><br>";
			if(data.project_number) details += "<br><b>Project Number :</b> " + data.project_number;
			if(data.associated_milestone_payment) details += "<br><b>Associated Milestone Payment :</b> " + data.associated_milestone_payment;
			if(data.description) details += "<br><b>Description :</b> " + data.description;
			if(data.amount) details += "<br><b>Amount :</b> " + data.amount;
			details += "<br><hr><h4>CUSTOMER DECISION</h4><br>";
			if(data.acceptance_is_complete) details += "<br><b>Acceptance is complete :</b> " + data.acceptance_is_complete;
			if(data.the_acceptance_criteria_have_been_met) details += "<br><b>The acceptance criteria have been met :</b> " + data.the_acceptance_criteria_have_been_met;
			details += "<br><hr><h4>APPROVALS</h4><br>";
			if(data.closure_tawari_name) details += "<br><b>Name :</b> " + data.closure_tawari_name;
			if(data.closure_tawari_position) details += "<br><b>Position :</b> " + data.closure_tawari_position;
			if(data.closure_tawari_sig) details += "<br><b>Signature :</b> " + data.closure_tawari_sig;
			if(data.closure_tawari_date) details += "<br><b>Date :</b> " + data.closure_tawari_date;
			
			details += "<br><br><br><br>"
			if(details){
				details = "<div style='font-size:13px;' align='center'></br><b class='text-muted'>Project Closure Details</b>" + details + "</div>";
			}
			
			$('.here').empty();
			$('.here').append(details);

		}
	});
};