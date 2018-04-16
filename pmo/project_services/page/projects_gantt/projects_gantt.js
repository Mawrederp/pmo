frappe.pages['projects-gantt'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Projects Gantt',
		single_column: true
	});

	page.main.html(frappe.render_template("project_select", {}));
	var project = frappe.ui.form.make_control({
		parent: page.main.find(".project"),
		df: {
			fieldtype: "Link",
			options: "Project",
			fieldname: "project",
			change: function(){
				// console.log(project.get_value())
				// page.main.find(".frappe-list").html("");

				// // show_project_info(project.get_value(), me);
				// // show_project_info_planning(project.get_value(), me);
				// // show_project_info_controlling(project.get_value(), me);
				// // show_project_info_closure(project.get_value(), me);

				// $(".project-details").css("display","block")
				
				// show_project_info(project.get_value(), me);
				// $(".project-details .row .project-phases .tab .inititaion").click(function(){
				//     show_project_info(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .planning").click(function(){
				//     show_project_info_planning(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .controlling").click(function(){
				//     show_project_info_controlling(project.get_value(), me);
				// });
				// $(".project-details .row .project-phases .tab .closure").click(function(){
				//     show_project_info_closure(project.get_value(), me);
				// });

			}
		},
		only_input: true,
	});
	project.refresh();
}