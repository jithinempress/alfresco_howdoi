define("HowDoILibrary", [ "require", "exports", "jquery", "dojo/_base/declare", "bootstrap", "jquery.dataTables" ], function(require, exports, $) {
	exports.__esModule = true;
	$(document).ready(function() {
		exports.init = function() {
			$('.loader').css('display', 'none');
			var proxyUrl = Alfresco.constants.PROXY_URI + "slingshot/datalists/data/node/workspace/SpacesStore/9c4ca5aa-267c-415a-bc42-eadff8f90004";
			var categories = [];
			getTopicCategoryList(); 
			rendetTable();	
			/**
			 * 
			 * @Method: Get total number of videos from a tag, for calculate
			 *          total number of pages for pagination
			 */
			function rendetTable(filter){
				var filterId = 'all', filterData = "";
				if(filter != null && filter != undefined){
					filterId = 'customFilter';
					filterData = 'lnindlfaq:topicCategory=\''+filter+'\'';
				}	
				var postData = {
						"fields": [
                                    "cm_name",
						           	"lnindlfaq_topicCategory",
						           	"lnindlfaq_faqdescription",
						           	"lnindlfaq_faqAnswer"
						],
						"filter": {
							"filterId": filterId,
							"filterData": filterData 
						}
					};
				this.howDoITable = null;
					this.howDoITable = $('#how_do_i_tbl').DataTable({
						ajax: function(data, callback, settings) {
							$.ajax({
								url: proxyUrl,
								method: 'POST',
								contentType:"application/json; charset=utf-8",
								dataType: "json",
								data: JSON.stringify(postData),
								processing: true,
								"oLanguage": {
									"sProcessing": "Hang on. Waiting for response..."
								},
								success: function(result){
									var howDoIList = [];
									$(result.items).each(function(index, element){
										howDoIList.push({
											"question": (element.itemData.prop_cm_name != null ? element.itemData.prop_cm_name.value : ""),
											"topicCategory": (element.itemData.prop_lnindlfaq_topicCategory != null ? element.itemData.prop_lnindlfaq_topicCategory.value : ""),
											"faqAnswer": (element.itemData.prop_lnindlfaq_faqAnswer != null ? element.itemData.prop_lnindlfaq_faqAnswer.value : ""),
											"description": (element.itemData.prop_lnindlfaq_faqdescription != null ? element.itemData.prop_lnindlfaq_faqdescription.value : "")
										});
									});
									callback({aaData:howDoIList});
								}
							});
						},
					    columns: [
					  			
					              		{
					              				render: function ( data, type, full, meta ) { 
					              					var windowWidth = $( window ).width();
					              					var tdWidth = windowWidth-(.3*windowWidth);
					              					$(" p ").css("width",tdWidth+"px");
					              					$(" p ").addClass("howdoi_5"); 
					              				if(full["topicCategory"] == "Tools and Resources"){	
					              						return '<a href="'+modifyData(full['faqAnswer'])+'" target="_blank"><b>'+full["question"]+'</b></a><br><p class="howdoi_5">'+full["description"]+'</p>';
					              				}else{
					              					var newHtml = full["faqAnswer"];
					              					return '<b>'+full["question"]+'</b><br>'+newHtml;	
					              				}	
					              				}
					              		}       		
					  		],
					  	"searching": true,
						"order": [[0, 'desc']],
						"iDisplayLength": 50,
						"language": {
						     "emptyTable": "No topics found."
						},
						columnDefs: [
						 			{
						 				width:	"100%",
						 				targets: [0]
						 			}
						 		]
					});
					function modifyData(link){
						link = link.replace('<p>','');
						link = link.replace('</p>','');
						return link;
					}
					$('#how_do_i_tbl').on('click', 'tbody td', function() {
						var columnKey = $('#how_do_i_tbl thead tr th').eq($(this).index()).html().trim();
						var trainingResult;
						if(columnKey == "Topics"){							
							var oTable = $('#how_do_i_tbl').DataTable();							
							var data = oTable.row(this).data();	
							if(data['topicCategory'] != "Tools and Resources"){
							trainingResult = '<div class="modal fade" id="howDoIDetails" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">How Do I?</h4></div><div class="modal-body"><div class="row"><div class="col-lg-12" style="margin-bottom: 10px;"><h4>'+data['question']+' ?</h4><p>'+data['faqAnswer']+'</p></div></div></div><div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div></div></div></div>';
							$('.howDoIDetailsWindow').html(trainingResult);	
							if($('.modal-backdrop') != null || $('.modal-backdrop') != undefined)
								$('.modal-backdrop').remove();
							$('#Share').css({"padding-right":"0px"});
							$('#howDoIDetails').modal('show');
							}
						}
					});
					var html = '<option value="">Select Category</option>';
					$(categories).each(function(index, element){
						var selected = '';
						if(filter != null && filter != undefined){
							selected = (element == filter) ? 'selected' : '';
						}
						html += '<option value="'+element+'" '+selected+'>'+element+'</option>';
					});
					
					$('#how_do_i_tbl_filter').prepend('<label>Topic Category:</label>&nbsp;&nbsp;<select name="how_do_i_tbl_length" aria-controls="how_do_i_tbl" class="how-do-i-topicCategory" style="height: 34px !important;padding: 6px 12px !important;font-size: 14px !important;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;padding: 5px;margin-right: 15px;">'+html+'</select>');
					
					/**
					 * topicCategory Filter
					 */
					$('.how-do-i-topicCategory').on('change', function() {
						$('#how_do_i_tbl').dataTable().fnDestroy();
						rendetTable(this.value);
					});
					// Placeholder text for dataTable search
					$('.dataTables_filter input').attr("placeholder", "Search items...");
			}			
			
			/**
			 * 
			 * @method: getTopicCategoryList
			 */
		function getTopicCategoryList(){	
			var proxyUrl = Alfresco.constants.PROXY_URI + "ln/constraints?property=%7Bhttp://www.lexisnexis.com/insider/faq/datalist/1.0%7DtopicCategory";
			$.ajax({
				url: proxyUrl,
				method: 'GET',
				contentType:"application/json; charset=utf-8",
				dataType: "json",
				async: false,
				 success: function(data){
					$(data.constraints).each(function(index, element){
							categories.push(element);
					});
				}
			});
	}
			function isNotAvailable(list, item){
				if(list.length == 0){
					return true;
				}else{
					for(var i = 0; i < list.length; i++) {
						if(list[i] == item)
							return false;
					}
					return true;
				}
			}
		}
	});
});
