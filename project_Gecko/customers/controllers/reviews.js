const reviews = require("../../clients/models/reviews");

const { generateTokenPayload } = require("../../utils/utils");


exports.postReview = async(req,res,next) =>{
	try {
		// get token from the headers
		const token = "";
		const payload = generateTokenPayload(token);

		const body = req.body;
		body.userId = payload.userId;

		const reviewStats = await new reviews.create(body);
		if (reviewStats === null){
			res.status(500).json({
				status:40,
				message:"Server Error"
			});
		}
		res.status(200).json({
			success:true,
			message:"review saved"
		});

	} catch (error) {
		next(error);
	}
};
