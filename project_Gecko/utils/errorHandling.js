

exports.defineError = (message,code)=>{
	const error = Error(`${message}`);
	error.status = code;
	return error;
};

exports.pageNotFound =(req,res)=>{
	res.json({
		error:{
			message:"Page Not Found",
			status:404
		}
	}).status(404);
};
exports.resErrors = async (err,req,res)=>{
	console.log("this is a new error");
	if (err.status == 401){
		res.status(401).json({
			error:{
				message:err.message,
				status:err.status
			}
		});
	}
	if (err.status == 404){
		res.status(404).json({
			error:{
				message:err.message,
				status:err.status
			}
		});
	}
	if (err.status == 500){
		res.status(500).json({
			error:{
				message:err.message,
				status:err.status
			}
		});
	}
	if (err.status == 403){
		res.status(403).json({
			error:{
				message:err.message,
				status:err.status
			}
		});
	}
};

// check for code 11000