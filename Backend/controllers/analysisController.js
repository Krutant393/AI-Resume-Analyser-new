const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

const analysisModel = require('../models/analysisModel');
const { analyzeResume } = require('../services/aiService');

const parseAnalysis = (value) => {
    const content = value
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '');

    return JSON.parse(content);
};

const uploadPDF = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "PDF required"
            });
        }

        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(req.file.buffer)
        }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            text += content.items
                .map(item => item.str)
                .join(" ");
        }

        const resume = await analysisModel.create({
            user: req.user.id,
            resume: text,
            analysis: "Analysis not yet performed"

        });

        res.json({
            success: true,
            resumeId: resume._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "PDF processing failed"
        });
    }
};







const analysisController = async(req, res) => {

    try {
        const { resumeId } = req.params;
        const { jobDescription } = req.body || {};

        if (!resumeId || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "resumeId URL parameter and jobDescription are required"
            });
        }

        const resume = await analysisModel.findOne({
            _id: resumeId,
            user: req.user.id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        const text = resume.resume;


        const response = await analyzeResume(text, jobDescription);
        const analysis = parseAnalysis(response);



        resume.analysis = JSON.stringify(analysis);
        await resume.save();




        res.json({

            success: true,
            message: "Analysis performed successfully",
            analysis
        })





    } catch (err) {
        if (err.response) {
            console.error("Analysis failed:", err.response.data);
        } else {
            console.error("Analysis failed:", err.message);
        }
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid resumeId"
            });
        }

        if (err instanceof SyntaxError) {
            return res.status(502).json({
                success: false,
                message: "AI provider returned invalid JSON"
            });
        }



        return res.status(500).json({
            success: false,
            message: err.message || "Analysis failed"
        });

    }





}

const responseController = async(req, res) => {

    try {
        const { resumeId } = req.params;

        const resume = await analysisModel.findOne({
            _id: resumeId,
            user: req.user.id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.json({
            success: true,
            resumeId: resume._id,
            analysis: resume.analysis === "Analysis not yet performed" ?
                null : parseAnalysis(resume.analysis)
        });
    } catch (err) {
        console.error("Fetching analysis failed:", err.message);

        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid resumeId"
            });
        }

        if (err instanceof SyntaxError) {
            return res.status(422).json({
                success: false,
                message: "Saved analysis is not valid JSON"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Could not fetch analysis"
        });
    }





}


module.exports = { analysisController, uploadPDF, responseController };;