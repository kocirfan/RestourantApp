const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const Restaurant = require("./models/Restaurant");
const User = require("./models/Users");





//DB connect 
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
    console.log("MongoDB veritabanına başarıyla bağlandı.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

/****** Problem6 */ 
app.get("/restaurants", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const totalCount = await Restaurant.countDocuments().exec();

    // Pagination için meta bilgilerini oluştur
    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.restaurants = await Restaurant.aggregate([
      {
        $unwind: "$reviews",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
    ])
      .skip(startIndex)
      .limit(limit)
      .exec();

    res.json(results);
    console.log(res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/****    Problem2 ******/
/*
async function findNearestRestaurants(longitude, latitude) {
    try {
      const nearestRestaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            distanceField: 'distance',
            spherical: true,
            //maxDistance: 10000, // İstediğiniz maksimum mesafe (metre cinsinden)
          },
        },
        {
          $limit: 5, // Sonucu sınırla
        },
        {
          $match: {
            description: { $regex: /lahmacun/i }
          }
        },
      ]);
      console.log('En yakın restoranlar:', nearestRestaurants);
      return nearestRestaurants;
    } catch (error) {
      console.error('Hata:', error);
      return [];
    }
  }


const latitude = 39.93;
const longitude = 32.85;


findNearestRestaurants(longitude, latitude);
*/

/****    Problem3 ******/
/*
try {
  const newMenuItems = [
    { name: "Küçük boy peynirli pizza", price: 50 },
    { name: "Orta boy mantarlı pizza", price: 100 },
    { name: "Hamburger", price: 120 },
  ];
  await Restaurant.findOneAndUpdate(
    { name: "Example Restaurant" },
    { $push: { menu: { $each: newMenuItems } } },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  console.log("Yeni menü öğeleri başarıyla eklendi.");
} catch (error) {
  await session.abortTransaction();
  session.endSession();

  console.error("Hata:", error);
}
*/

/** Problem 4 */ 
/*
const pipeline = [
    {
      $lookup: {
        from: 'comments', // Yorumların bulunduğu koleksiyon
        localField: '657f682b51c84cb53d985d6c', // Kullanıcı kimliği (user ID)
        foreignField: '657f682b51c84cb53d985d6b', // Yorumların kullanıcı kimliği (user ID)
        as: 'user_comments', // Yorumlar
      },
    },
    {
      $lookup: {
        from: 'restaurants', // Restoranların bulunduğu koleksiyon
        localField: 'user_comments.restaurantId', // Yorumların restoran kimliği (restaurant ID)
        foreignField: '_id', // Restoranların kimliği (restaurant ID)
        as: 'restaurant_comments', // Restoran yorumları
      },
    },
    {
      $match: {
        gender: 'male', // Cinsiyeti erkek olanlar
        restaurant_comments: { $exists: true, $ne: [] }, // Restoran yorumları olanlar
      },
    },
    {
      $sort: { age: -1 }, // Yaşa göre sıralama
    },
    {
      $limit: 20, // İlk 20 erkek kullanıcı
    },
  ];

  User.aggregate(pipeline)
  .then((results) => {
    console.log('Son yorum yapan 20 erkek kullanıcı yaşa göre sıralandı:', results);
  })
  .catch((err) => {
    console.error(err);
  });
*/

/*****  Problem5  */ 
/*
User.aggregate([
    {
      $match: { gender: 'male' } // Sadece erkek kullanıcılar
    },
    {
      $unwind: '$orders' // Her bir kullanıcının siparişlerini ayrı ayrı ele al
    },
    {
      $unwind: '$orders.comments' // Siparişlerdeki yorumları ayrı ayrı ele al
    },
    {
      $sort: { 'orders.comments.date': -1 } // Yorum tarihine göre azalan sıralama
    },
    {
      $limit: 20 // İlk 20 son yorumu al
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' }, // İlk kullanıcı adı
        age: { $first: '$age' }, // İlk yaş
        latestCommentDate: { $first: '$orders.comments.date' } // En son yorum tarihi
      }
    },
    {
      $sort: { age: 1 } // Yaşa göre artan sıralama
    }
  ])
  .then((results) => {
    console.log('Son yorum yapan 20 erkek kullanıcı yaşa göre sıralandı:', results);
  })
  .catch((err) => {
    console.error(err);
  });

*/