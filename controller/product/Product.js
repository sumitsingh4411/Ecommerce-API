const Joi = require('joi');
var multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorHandler = require("../../service/ErrorHandler");
const product = require('../../modal/product');
const { userInfo } = require('os');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniquename)
    }
})

const handlemultipartdata = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image');
const Product = {
    async addproduct(req, res, next) {
        handlemultipartdata(req, res, async (err) => {
            if (err)
                return next(ErrorHandler.servererror());
            const filePath = req.file.path;

            const productSchema = Joi.object({
                name: Joi.string().min(3).max(30).required(),
                price: Joi.number().required(),
                image: Joi.string(),
            })

            const { error } = productSchema.validate(req.body);
            if (error) {
                fs.unlink(`{approot}/${filePath}`, (err) => {
                    if (err)
                        return next(ErrorHandler.servererror());
                })
                return next(error);

            }
            const { name, price } = req.body;
            let document = '';
            try {
                document = await product.create({
                    name, price, image: filePath
                })

            } catch (error) {
                return next(error);
            }

            res.status(201).json(document);
        })
    },
    async updateproduct(req, res, next) {
        handlemultipartdata(req, res, async (err) => {
            if (err)
                return next(ErrorHandler.servererror());
            let filePath;
            if (req.file)
                filePath = req.file.path;

            const productSchema = Joi.object({
                name: Joi.string().min(3).max(30).required(),
                price: Joi.number().required(),
                image: Joi.string(),
            })

            const { error } = productSchema.validate(req.body);
            if (error) {
                if (req.file) {
                    fs.unlink(`{approot}/${filePath}`, (err) => {
                        if (err)
                            return next(ErrorHandler.servererror());
                    })
                }
                return next(error);

            }
            const { name, price } = req.body;
            let document = '';
            try {
                document = await product.findOneAndUpdate({ _id: req.params.id }, {
                    name, price,
                    ...(req.file && { image: filePath })

                }, { new: true })

            } catch (error) {
                return next(error);
            }

            res.status(201).json(document);
        })
    },
    async deleteproduct(req, res, next) {
        const data = await product.findByIdAndRemove({ _id: req.params.id });
        if (!data)
            return next(new Error('nothing to delete'));
        const imagpath = data._doc.image;
        fs.unlink(`${approot}/${imagpath}`, (err) => {
            if (err)
                return next(ErrorHandler.servererror());
        })
        res.json({ data });
    },
    async all(req, res, next) {
        let data;
        try {
            data = await product.find();
        } catch (error) {
            return next(ErrorHandler.servererror());
        }
        res.json(data)
    },
    async getone(req, res, next) {
        let data;
        try {
            data = await product.findOne({ _id: req.params.id });
        } catch (error) {
            return next(ErrorHandler.servererror());
        }
        res.json(data)
    }
}

module.exports = Product;