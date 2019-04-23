frappe.pages['project-dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Project Dashboard',
		single_column: true
	});


	page.main.html(frappe.render_template("project_dashboard", {}));

	get_pmo_resources();

	var project_filter = frappe.ui.form.make_control({
		parent: page.main.find(".project-filter"),
		df: {
			fieldtype: "Link",
			options: "Projects List",
			fieldname: "project",
			placeholder: __("Project"),
			change: function(){
				if (project_filter.get_value() != ""){
					let filters = {
						"project":project_filter.get_value(),
					}
					get_init_data(filters);
					event.stopImmediatePropagation();
				}
				else {
					get_init_data({});
				}

			}
		},
		only_input: true,
	});



	project_filter.refresh();

	
	get_init_data({});


}








	
get_init_data = function (filters){
	setTimeout(function () {
		
		get_project_managment_assignment(filters);
		get_project_info(filters);
		get_project_finance(filters);

		chart_donut_get_data("total_cost",filters);
		chart_donut_get_data("selling_price",filters);
		chart_donut_get_data("contingency",filters);
		chart_donut_get_data("final_selling_price",filters);
		// chart_line_get_data("billing",filters);
		chart_stacked_get_data("billing",filters);

	  }, 400);
}


get_pmo_resources = function (){
	data = "No Data"
	$("#pmo-resources").text("");
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_pmo_resources",
			callback: function(r) {
				if(r.message) {
					$("#pmo-resources").text("");
					for (let elem in r.message) {  
					  var markup = 
					  "<tr> <td>"+r.message[elem][0]+
					  "</td><td>"+r.message[elem][1]+
					  "</td> <td>"+r.message[elem][2]+
					  "</td> </tr>";	
					  $("#pmo-resources").append(markup);
					}
				}
			}
	})
	
}


get_project_managment_assignment = function (filters){
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_project_managment_assignment",
			args: {
				args:filters
			},
			callback: function(r) {
				if(r.message) {
					$(".assignments_disapear").removeClass("hide_assignments");
					if(r.message[0]){
						$("#program_manager").text(r.message[0])
					}else{
						$("#program_manager").text('--')
					}
					if(r.message[1]){
						$("#senior_project_manager").text(r.message[1])
					}else{
						$("#senior_project_manager").text('--')
					}
					if(r.message[2]){
						$("#project_manager").text(r.message[2])
					}else{
						$("#project_manager").text('--')
					}
					if(r.message[3]){
						$("#project_coordinator").text(r.message[3])
					}else{
						$("#project_coordinator").text('--')
					}
					
				}else{
					$(".assignments_disapear").addClass('hide_assignments');
					$("#program_manager").text('--')
					$("#senior_project_manager").text('--')
					$("#project_manager").text('--')
					$("#project_coordinator").text('--')
				}
			}
	})
}


get_project_info = function (filters){
	data = "No Data"
	$("#project-info").text("");
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_project_info",
			args: {
				args:filters
			},
			callback: function(r) {
				if(r.message) {
					$("#project-info").text("");
					for (let elem in r.message) {
					  var markup = 
					  "<tr> <td>"+r.message[elem][0]+
					  "</td><td>"+r.message[elem][1]+
					  "</td> <td>"+r.message[elem][2]+
					  "</td> <td>"+r.message[elem][3]+
					  "</td> <td>"+r.message[elem][4]+
					  "</td> </tr>";	
					  $("#project-info").append(markup);
					}
				}
			}
	})
	
}





get_project_finance = function (filters){
	$(".project-finance").text("");
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_project_finance",
			args: {
				args:filters
			},
			callback: function(r) {
				if(r.message) {
					var markup = ''
					$(".project-finance").text("");
					$(".finance_disapear").removeClass("hide_finance");
					for (let elem in r.message[0]) {
						markup += 
						"<div class='panel panel-default'>"+
						"<div class='panel-heading' role='tab' id='heading"+elem+"'>"+
						"<h4 class='panel-title'> <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+elem+"' aria-expanded='true' aria-controls='collapse"+elem+"'>"+r.message[0][elem]+"</a> </h4></div>"+
						"<div id='collapse"+elem+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+elem+"'>"+
						"<div class='table-responsive'>"+
						"<table class='table table-bordered table-hover' style='text-align: right;margin:0;'>"+
						"<thead><tr><th>item_name</th><th>total_cost</th><th>selling_price</th><th>profit</th><th>contingency</th><th>final_selling_price</th></tr></thead><tbody>"


						for(let item=0;item<r.message[1][elem].length;item++) {
							markup+=
							"<tr>"+
							"<td>"+r.message[1][elem][item][0]+"</td>"+
							"<td>"+r.message[1][elem][item][1]+"</td>"+
							"<td>"+r.message[1][elem][item][2]+"</td>"+
							"<td>"+r.message[1][elem][item][3]+"</td>"+
							"<td>"+r.message[1][elem][item][4]+"</td>"+
							"<td>"+r.message[1][elem][item][5]+"</td>"+
							"</tr>"

						}

						markup+=
						"<tr style='background-color:#cad1d7!important;'>"+
						"<td>Total</td>"+
						"<td>"+r.message[2][elem]+"</td>"+
						"<td>"+r.message[3][elem]+"</td>"+
						"<td>"+r.message[4][elem]+"</td>"+
						"<td>"+r.message[5][elem]+"</td>"+
						"<td>"+r.message[6][elem]+"</td>"+
						"</tr>"


						markup+=
						"</tbody></table></div></div></div>"

					}
					
					$(".project-finance").append(markup);
					console.log(markup)
				}else{
					$(".finance_disapear").addClass('hide_finance');
					
				}
			}
	})
}






chart_donut_get_data = function(label,filters){
	let data =[]
	
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_"+label,
			args: {
				args:filters
			},
			callback: function(r) {
				if(r.message) {
					$('#morris-donut-chart-'+label).empty();
					let data = r.message
					for (let elem in data) {
						data[elem]["label"] = __(data[elem]["label"])
					}
					Morris.Donut({
						element: 'morris-donut-chart-'+label,
						data: r.message,
						colors: [
							'#6156ce',
							'#00d1c1',
							'#EF6C00'
						],
						resize: true
					});
				}
			}
	})
	return data

}



chart_line_get_data = function(label,filters){
	let data =[]
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_"+label,
			args: {
				args:filters
			},
			callback: function(r) {
				$("#morris-line-chart-"+label).empty();
				if(r.message) {
					console.log(r.message)
					// Line Chart
					Morris.Line({
						// ID of the element in which to draw the chart.
						element: 'morris-line-chart-'+label,
						// Chart data records -- each entry in this array corresponds to a point on
						// the chart.
						data: r.message,
						// The name of the data record attribute that contains x-leavess.
						xkey: 'd',
						// A list of names of data record attributes that contain y-leavess.
						ykeys: [label],
						// Labels for the ykeys -- will be displayed when you hover over the
						// chart.
						labels: [label],
						// Disables line smoothing
						lineColors: ['#00d1c1'],
						smooth: false,
						resize: true
					});
				}
			}
	})
	return data

}







chart_stacked_get_data = function(label,filters){


// 	var data = [
//       { y: '2014', a: 50, b: 90},
//       { y: '2015', a: 65,  b: 75},
//       { y: '2016', a: 50,  b: 50},
//       { y: '2017', a: 75,  b: 60},
//       { y: '2018', a: 80,  b: 65},
//       { y: '2019', a: 90,  b: 70},
//       { y: '2020', a: 100, b: 75},
//       { y: '2021', a: 115, b: 75},
//       { y: '2022', a: 120, b: 85},
//       { y: '2023', a: 145, b: 85},
//       { y: '2024', a: 160, b: 95}
//     ],
//     config = {
//       data: data,
//       xkey: 'y',
//       ykeys: ['a', 'b'],
//       labels: ['Total Billed', 'Total Remaining'],
//       fillOpacity: 0.6,
//       hideHover: 'auto',
//       behaveLikeLine: true,
//       resize: true,
//       pointFillColors:['#ffffff'],
//       pointStrokeColors: ['black'],
//       lineColors:['gray','red']
//   };

// config.element = 'stacked';
// config.stacked = true;
// Morris.Bar(config);




	let data =[]
	frappe.call({
			method: "pmo.project_services.page.project_dashboard.project_dashboard.get_"+label,
			args: {
				args:filters
			},
			callback: function(r) {
				$("#morris-stacked-chart-"+label).empty();
				if(r.message) {
    config = {
      data: r.message,
      xkey: 'y',
      ykeys: ['a', 'b'],
      xLabelAngle: 270,
      labels: ['Total Billed', 'Total Remaining'],
      fillOpacity: 0.6,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors:['#ffffff'],
      pointStrokeColors: ['black'],
      lineColors:['gray','red']
  };

}

config.element = 'morris-stacked-chart-'+label;
config.stacked = true;
Morris.Bar(config);


			}
	})
	return data

}

