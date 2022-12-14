import { Request, Response, NextFunction } from 'express'
import UserDB from '../dataAccess/UserDB';
import { ValidHotel } from '../validation/hotelValidator';
import { validate } from 'class-validator';

const userDB = UserDB.getInstance();

export const userExistInDB = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    userDB.checkIfUserExists(userId).then((result) => {
        if ((result as Array<any>).length > 0) next();
        else res.status(404).send("User not found");
    }).catch((error) => {
        res.status(500).send("Error checking user")
    });
}

export const hotelFormatValidate = (req: Request, res: Response, next: NextFunction) => {
    const { location_id, hotel_name, hotel_lat, hotel_lng, photo_url_large, photo_url_original, hotel_price, hotel_rating, hotel_address, num_reviews, hotel_ranking, contact_number, price_level, awards, services } = req.body;
    const validHotel = new ValidHotel(location_id, hotel_name, hotel_lat, hotel_lng, photo_url_large, photo_url_original, hotel_price, hotel_rating, hotel_address, num_reviews, hotel_ranking, contact_number, price_level, awards, services);

    validate(validHotel, { validationError: { target: false } }).then(errors => {
        if (errors.length > 0) {
            res.status(400).send(errors);
        } else {
            next();
        }
    });

}