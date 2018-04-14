frappe.pages['project-info'].on_page_load = function(wrapper) {
	var me = this;
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Project Information',
		single_column: true
	});

	page.main.html(frappe.render_template("project_select", {}));
	var project = frappe.ui.form.make_control({
		parent: page.main.find(".project"),
		df: {
			fieldtype: "Link",
			options: "Project Initiation",
			fieldname: "project",
			change: function(){
				// console.log(project.get_value())
				page.main.find(".frappe-list").html("");
				show_project_info(project.get_value(), me);
				// draw_page(project.get_value(), me);
			}
		},
		only_input: true,
	});
	project.refresh();



	var parent = $('<div class="project-info"></div>').appendTo(wrapper);
	parent.html(frappe.render_template("project_info", {}));



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
			if(data.name) details += "<br><b>Name :</b> " + data.name;
			
			// if(data.mobile) details += "<br><b>Mobile :</b> " + data.mobile;
			// if(data.occupation) details += "<br><b>Occupation :</b> " + data.occupation;
			// if(data.blood_group) details += "<br><b>Blood group : </b> " + data.blood_group;
			// if(data.allergies) details +=  "<br><br><b>Allergies : </b> "+  data.allergies;
			// if(data.medication) details +=  "<br><b>Medication : </b> "+  data.medication;
			// if(data.alcohol_current_use) details +=  "<br><br><b>Alcohol use : </b> "+  data.alcohol_current_use;
			// if(data.alcohol_past_use) details +=  "<br><b>Alcohol past use : </b> "+  data.alcohol_past_use;
			// if(data.tobacco_current_use) details +=  "<br><b>Tobacco use : </b> "+  data.tobacco_current_use;
			// if(data.tobacco_past_use) details +=  "<br><b>Tobacco past use : </b> "+  data.tobacco_past_use;
			// if(data.medical_history) details +=  "<br><br><b>Medical history : </b> "+  data.medical_history;
			// if(data.surgical_history) details +=  "<br><b>Surgical history : </b> "+  data.surgical_history;
			// if(data.surrounding_factors) details +=  "<br><br><b>Occupational hazards : </b> "+  data.surrounding_factors;
			// if(data.other_risk_factors) details += "<br><b>Other risk factors : </b> " + data.other_risk_factors;
			// if(data.patient_details) details += "<br><br><b>More info : </b> " + data.patient_details;


			


			if(details){
				details = "<div style='padding-left:10px; font-size:13px;' align='center'></br><b class='text-muted'>Project Details</b>" + details + "</div>";
			}
			// console.log(details)

			// var vitals = "";
			// if(data.temperature) vitals += "<br><b>Temperature :</b> " + data.temperature;
			// if(data.pulse) vitals += "<br><b>Pulse :</b> " + data.pulse;
			// if(data.respiratory_rate) vitals += "<br><b>Respiratory Rate :</b> " + data.respiratory_rate;
			// if(data.bp) vitals += "<br><b>BP :</b> " + data.bp;
			// if(data.bmi) vitals += "<br><b>BMI :</b> " + data.bmi;
			// if(data.height) vitals += "<br><b>Height :</b> " + data.height;
			// if(data.weight) vitals += "<br><b>Weight :</b> " + data.weight;
			// if(data.signs_date) vitals += "<br><b>Date :</b> " + data.signs_date;

			// if(vitals){
			// 	vitals = "<div style='padding-left:10px; font-size:13px;' align='center'></br><b class='text-muted'>Vital Signs</b>" + vitals + "<br></div>";
			// 	details = vitals + details;
			// }
			// if(details) details += "<div align='center'><br><a class='btn btn-default btn-sm edit-details'>Edit Details</a></b> </div>";

			// me.page.main.html(details);

			// $('.project-details .row .project-phases').append(details);
			$('.here').empty();
			$('.here').append(details);

		}
	});
};