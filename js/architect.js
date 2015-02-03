// Architect Name & Description //

function writeName() {
	document.new_job.job_name.value = "Architect Needed | " + document.new_job.job_suburb.value.split(",")[0];
}
	
function writeDesc() {

	// Customer name
    var userName = document.new_job.user_name.value;

    // Location of the job - must be an Australian suburb eg Bondi, NSW, 2026
    var jobSuburb = document.new_job.job_suburb.value;

    // Options: 'residential', 'commercial'
    var jobType = document.new_job.job_type.value;
	
	    // Options: 'builder required also', 'no builder required'
    var jobBuilder = document.new_job.job_builder.value;
	
		// Options: 'ASAP urgent', 'withing next few days', 'within next fortnight', ' within next few months'
    var jobTime = document.new_job.job_time.value;
			 
	// Tests the comments variable 
	if((document.new_job.job_comments.value==null) || (document.new_job.job_comments.value.length==0))
		var jobComments = "" 
	else
		var jobComments = userName + "'s comments: " +  document.new_job.job_comments.value;

	 // Create a variable to use as a line break
     var singleLineBreak = "\n";
	 var doubleLineBreak = "\n\n";

	 document.new_job.job_description.value = "Customer name: " + userName + singleLineBreak +
											  "Job location: " + jobSuburb + singleLineBreak +
											  "Date required: " + jobTime + doubleLineBreak +										  
											  "Architectural plans for: " + jobType + singleLineBreak +
											  "Builder required: " + jobBuilder + singleLineBreak +										  
											  jobComments;     
	}




