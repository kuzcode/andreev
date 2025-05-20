import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.kuzmin.mebel",
  projectId: "6828631a0007c7e9362c",
  storageId: "682d00780037ccb8fa0d",
  databaseId: "6828634c00034bfc5c81",
  userCollectionId: "6828635d000e2b93c5bd",
  ordersCollectionId: "6828637c00009a64cb53",
  modelsCollectionId: "682863940032a0fb872e",
  mastersCollectionId: "682863b5002fc6de21e8",


  videoCollectionId: "664361be001d94a207b5",
  commsCollectionId: "6738ad5600015f0c9dc5",
  mapCollectionId: "66ce01d2001ca5a26ab5",
  markerCollectionId: "66cdfd33003c3196a832",
  trainingsCollectionId: "66c24424003ac2b404f4",
  trackersCollectionId: "66dbf058001a7fad3d97",
  routesCollectionId: "670192ce002213fc53b2",
  completedCollectionId: "670b6de50001fdbb67ad",
  mealCollectionId: "6740dd300031622f584f",
  quotesCollectionId: "6782a413001c35ef0184",
  weeklyCollectionId: "679f506e002ff0b8797f",
  newsCollectionId: "67a0db74002e12a5afbf",
  requestCollectionId: "67a88df2001d8edd69fb",
  calendarCollectionId: "67b1db1c003a12d7202b",
  repeatenCollectionId: "67b780b20017eedcb860",
  planCollectionId: "67b1de5e001a6d2b3403",
  awardsCollectionId: "67bb025c003ad6af02f7",
  userAwardsCollectionId: "67bb02c50018a61c8749",
  gymbrosCollectionId: "67bc82a0000b006ce97a",
  notifsCollectionId: "67bc9b7d0018b34113ed",
  friendsCollectionId: "67bf30fc003617198a6b",
  coCollectionId: "67bf84bc003df826c000",
  postCollectionId: "67c0c5e6003a29869c2d",
  hotCollectionId: "67c1e258000ff1d6afa1",
  liveCollectionId: "67c2c5930012fea6d871",
  valuesCollectionId: "67e58763000be1791311",
  mealCollectionId: "67e6bb2e0036ad539485",
  commentsCollectionId: "67e90958003e30e8fbd4",
};

import { rank } from "../constants/types";

import AsyncStorage from '@react-native-async-storage/async-storage';

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Функция для создания безопасного ID из email
function createSafeId(email) {
  // Remove any special characters and ensure it starts with a letter or number
  const safeId = email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_') // replace invalid chars with underscore
    .replace(/^[^a-z0-9]/, 'u_') // ensure it starts with a valid char
    .substring(0, 36); // limit to 36 chars

  return safeId;
}

// Register user
export async function createUser(form) {
  try {

    // Создаем аккаунт с безопасным ID
    const newAccount = await account.create(
      ID.unique(),
      form.email,
      form.password,
      'kuzyaas'
    );

    if (!newAccount) throw Error;

    // Создаем документ пользователя
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        name: form.name,
        balance: 0,
        role: 1,
      }
    );

    // Создаем сессию после успешного создания аккаунта
    await signIn(form.email, form.password);

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    // Get current account
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    // Get user document using the account ID
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", currentAccount.$id)]
    );

    if (!currentUser || !currentUser.documents || currentUser.documents.length === 0) {
      throw Error;
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log('Error in getCurrentUser:', error);
    return null;
  }
}

export async function updateOrder(order) {
  try {
    console.log('Данные, отправляемые в updateOrder:', {
      designerName: order.designerName,
      designerPhone: order.designerPhone,
      prorabName: order.prorabName,
      prorabPhone: order.prorabPhone
    });

    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      order.$id,
      {
        title: order.title,
        adress: order.adress,
        payments: order.payments,
        customer: order.customer,
        endDate: order.endDate,
        models: order.models.map(model => ({
          ...model,
          icons: model.icons || Array(13).fill(0)
        })),
        designerName: String(order.designerName || ''),
        designerPhone: String(order.designerPhone || ''),
        prorabName: String(order.prorabName || ''),
        prorabPhone: String(order.prorabPhone || '')
      }
    );

    console.log('Результат обновления:', result);
    return result;
  } catch (error) {
    console.error('Ошибка в updateOrder:', error);
    throw new Error(error);
  }
}

export async function updateModel(model) {
  try {
    console.log('Полученные данные в updateModel:', model);
    console.log('Charges в updateModel:', model.charges);
    console.log('Masters в updateModel:', model.masters);

    // Создаем массив из 13 комментариев
    const comments = Array(13).fill('').map((_, index) =>
      model.operationComments?.[index] || ''
    );

    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.modelsCollectionId,
      model.$id,
      {
        title: model.title,
        status: model.status,
        price: model.price,
        icons: model.icons,
        bg: model.bg,
        charges: model.charges || [],
        masters: model.masters?.map(master => ({
          name: master.name,
          cost: Number(master.cost) || 0,
          icon: Number(master.icon) || 0,
          id: master.id
        })) || [],
        comments: model.comments,
        archived: model.archived
      }
    );

    console.log('Результат обновления:', result);
    return result;
  } catch (error) {
    console.error('Ошибка в updateModel:', error);
    throw new Error(error);
  }
}

// Sign Out
export async function signOut() {
  try {
    // Delete the current session
    await account.deleteSession("current");

    // Clear stored session
    await AsyncStorage.removeItem('session');

    return true;
  } catch (error) {
    console.log('Error in signOut:', error);
    throw new Error(error);
  }
}

export async function createOrder(form) {
  try {
    const newTracker = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      {
        title: form.title,
        adress: form.adress,
        payments: form.payments,
        customer: form.customer,
        endDate: form.endDate,
        models: form.modules
      }
    );
    console.log(form)

    return newTracker;
  } catch (error) {
    throw new Error(error);
  }
}


// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sendNotif(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notifsCollectionId,
      ID.unique(),
      {
        userId: form.sendTo,
        title: 'заявка в друзья',
        isRead: false,
        sentBy: 0,
        sentById: form.userId,
        type: 1,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sendNotification(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notifsCollectionId,
      ID.unique(),
      {
        userId: form.sentTo,
        title: form.title,
        isRead: false,
        sentBy: form.sentBy,
        sentById: form.sentById,
        type: form.type,
        contentId: form.contentId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createPost(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        caption: form.caption,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createFriends(userId) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      ID.unique(),
      {
        userId: userId,
        friends: []
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sendRequest(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.requestCollectionId,
      ID.unique(),
      {
        title: form.name,
        caption: form.caption,
        userId: form.userId,
        type: form.type,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createGymbro(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gymbrosCollectionId,
      ID.unique(),
      {
        userId: form.userId,
        gymName: form.gymName,
        shortDescription: form.shortDescription,
        description: form.description,
        contact: form.contact,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createCo(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.coCollectionId,
      ID.unique(),
      {
        creator: form.userId,
        title: form.title,
        contact: form.contact,
        description: form.description,
        place: form.place,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}


export async function createWeeklyReport(form) {
  try {
    const done = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.weeklyCollectionId,
      ID.unique(),
      {
        userId: form.userId,
        weight: form.weight,
      }
    );

    return done;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createUserAwards(userId) {
  try {
    const done = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userAwardsCollectionId,
      ID.unique(),
      {
        userId: userId,
        awards: []
      }
    );

    return done;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getWeeklyReport(form) {
  try {
    const today = new Date();
    const date7DaysAgo = new Date(today);
    date7DaysAgo.setDate(today.getDate() - 7);

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.weeklyCollectionId,
      [Query.equal('userId', form.userId)]
    );

    return result.documents[0];
  } catch (error) {
    throw new Error(error);
  }
}


export async function getAwards() {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.awardsCollectionId
    );

    return result.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserAwards(userId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userAwardsCollectionId,
      [Query.equal('userId', userId)]
    );

    if (result.documents.length === 0) {
      const created = await createUserAwards(userId);
      return created;
    }

    return result.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPostComments(postId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal('postId', postId)]
    );

    return result.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserValues(userId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.valuesCollectionId,
      [Query.equal('userId', userId)]
    );

    return result.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function startMeal(form) {
  try {
    const mealData = {
      userId: form.userId,
      goal: form.goal,
      eaten: [],
      type: form.type,
      height: parseInt(form.height),
      weight: parseInt(form.weight),
    };

    // Сохраняем данные в AsyncStorage
    await AsyncStorage.setItem('mealData', JSON.stringify(mealData));

    return mealData; // Возвращаем сохраненные данные
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateWeekly(userId, weight) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.weeklyCollectionId,
      [Query.equal('userId', userId)]
    );

    console.log(result)

    if (result.documents.length === 0) {
      createWeeklyReport({
        userId: userId,
        weight: weight,
      })
      return;
    }


    const documentId = result.documents[0].$id;
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.weeklyCollectionId,
      documentId,
      {
        weight: weight
      }
    );

    return updatedDocument;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateValues(form) {
  try {
    const updatedDocument = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.valuesCollectionId,
      form.$id,
      {
        stats: form.stats
      }
    );

    return updatedDocument;
  } catch (error) {
    throw new Error(error);
  }
}


export async function readAllNotifs(userId) {
  try {
    // Получаем документы, где userId равен переданному значению
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notifsCollectionId,
      [Query.equal('userId', userId)]
    );

    if (result.documents.length === 0) {
      throw new Error('No notifications found for this user');
    }

    // Обновляем каждый документ, устанавливая isRead в true
    const updates = result.documents.map(async (document) => {
      const documentId = document.$id;
      return await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.notifsCollectionId,
        documentId,
        { isRead: true }
      );
    });

    // Ожидаем выполнения всех обновлений
    const updatedDocuments = await Promise.all(updates);

    return updatedDocuments;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRoute(form) {
  try {
    const newRoute = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.routesCollectionId,
      ID.unique(),
      {
        userId: form.userId,
        coord: form.coords,
        description: form.descr
      }
    );

    return newRoute;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createCalendar(userId) {
  try {
    const newCal = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.calendarCollectionId,
      ID.unique(),
      {
        userId: userId,
      }
    );

    return newCal;
  } catch (error) {
    throw new Error(error);
  }
}

export async function saveCompleted(userId, type, time, distance, exercises, description, coordinates, effort) {
  const dataToSave = {
    userId: userId,
    typ: type,
    exercises: exercises,
    description: description,
    effort: effort,
  };

  if (time && time !== 0) {
    dataToSave.time = time;
  }
  if (distance && distance !== 0) {
    dataToSave.distance = parseFloat(distance);
    dataToSave.coordinates = coordinates;
  }

  console.log(typeof dataToSave.distance)

  try {
    const completed = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      ID.unique(),
      dataToSave
    );

    return completed;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createTracker(form) {
  try {
    const newTracker = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trackersCollectionId,
      ID.unique(),
      {
        name: form.name,
        goal: form.goal,
        done: 0,
        color: form.color,
        type: form.type,
        userId: form.userId
      }
    );

    return newTracker;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createMap(userId, marker) {
  try {
    const map = await databases.listDocuments(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.mapCollectionId,
      [Query.equal("userId", userId)]
    );

    const newMarker = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.markerCollectionId,
      ID.unique(),
      {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        time: 0
      }
    );

    const existingMarkers = map.documents[0].markers || [];

    // Add the new marker to the markers array
    const updatedMarkers = [...existingMarkers, newMarker.$id];



    if (map.length !== 0) {
      const result = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.mapCollectionId,
        map.documents[0].$id, // documentId
        {
          markers: updatedMarkers,
        }
      );

      return result;
    }
    else {
      const newMap = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.mapCollectionId,
        ID.unique(),
        {
          userId: userId,
          markers: [newMarker.$id],
        }
      );
      return newMap;
    }
  } catch (error) {
    throw new Error(error);
  }
}


// Get all video Posts
export async function getOrders() {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId
    );

    return orders.documents;
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw new Error(`Ошибка при получении заказов: ${error.message}`);
  }
}

export async function getPeople() {
  try {
    const people = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
    );

    return people.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMeal() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.mealCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getLive() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.liveCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getHot() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.hotCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllQuotes(userId) {
  try {
    const quotes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.quotesCollectionId,
    );

    const filteredQuotes = quotes.documents.map(quote => {
      const isLikedByUser = quote.liked.includes(userId);
      const likeCount = quote.liked.length;

      return {
        isLikedByUser,
        likeCount,
        id: quote.$id,
        quote: quote.quote, // Если атрибут цитаты называется 'text'
        img: quote.img,       // Если атрибут изображения называется 'img'
      };
    });

    return filteredQuotes;
  } catch (error) {
    throw new Error(error);
  }
}


export async function likeQuote(quoteId, userId) {
  try {
    // Получаем документ цитаты
    const quote = await databases.getDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.quotesCollectionId, // collectionId
      quoteId // documentId
    );

    // Проверяем, не добавлен ли userId уже в список лайков
    if (!quote.liked.includes(userId)) {
      // Обновляем список лайков
      const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.quotesCollectionId, // collectionId
        quoteId, // documentId
        {
          liked: [...quote.liked, userId], // добавляем userId
        } // data (optional)
      );

      return result;
    } else {
      var index = quote.liked.indexOf(userId);
      var tosave = quote.liked.splice(index, 1);
      const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.quotesCollectionId, // collectionId
        quoteId, // documentId
        {
          liked: tosave, // remove userId from liked array
        } // data (optional)
      );
      return result;
    }

  } catch (error) {
    throw new Error(error);
  }
}

export async function updateTracker(tracker) {
  try {
    const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.trackersCollectionId, // collectionId
      tracker.id, // documentId
      {
        name: tracker.name,
        goal: tracker.goal,
        today: tracker.today,
        done: tracker.done,
      }, // data (optional)
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export async function addToFriends(adder, adding) {
  try {
    const list = await getUserFriends(adder);
    console.log('list: ', list[0].$id);

    var newFrens = list[0].friends;
    newFrens.push(adding)
    console.log('adding: ', newFrens)

    const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.friendsCollectionId, // collectionId
      list[0].$id, // documentId
      {
        userId: adder,
        friends: newFrens,
      }, // data (optional)
    );

    const lista = await getUserFriends(adding);
    console.log('list: ', lista[0].$id);

    var newFrens = lista[0].friends;
    newFrens.push(adder)

    const resulta = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.friendsCollectionId, // collectionId
      lista[0].$id, // documentId
      {
        userId: adding,
        friends: adder,
      }, // data (optional)
    );


    return result, resulta;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteFriend(deleter, deleting) {
  try {
    const list = await getUserFriends(deleter);
    var newFrens = list[0].friends.filter(friend => friend !== deleting);

    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      list[0].$id,
      {
        userId: deleter,
        friends: newFrens,
      },
    );

    const lista = await getUserFriends(deleting);
    var newFrensFromOther = lista[0].friends.filter(friend => friend !== deleter);

    const resulta = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      lista[0].$id,
      {
        userId: deleting,
        friends: newFrensFromOther,
      },
    );

    return [result, resulta];
  } catch (error) {
    throw new Error(error);
  }
}

export async function setCoins(userId, amount) {
  try {
    const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.userCollectionId, // collectionId
      userId, // documentId
      {
        balance: parseInt(amount),
      }, // data (optional)
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function setExp(user, amount) {
  try {
    if (amount > rank[(user.rank - 1)].exp) {
      const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        user.$id, // documentId
        {
          exp: parseInt(amount),
          rank: user.rank + 1
        }, // data (optional)
      );
      return result;
    }
    else {
      const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        user.$id, // documentId
        {
          exp: parseInt(amount),
        }, // data (optional)
      );
      return result;
    }

  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUser(form) {
  try {
    const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.userCollectionId, // collectionId
      form.$id, // documentId
      {
        name: form.name,
        balance: form.balance,
        cashouts: form.cashouts,
      },
    );

    return result;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error(error.message); // Передаем только сообщение об ошибке
  }
}

export async function updateUserSports(form) {
  try {
    const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.userCollectionId, // collectionId
      form.id, // documentId
      {
        sports: form.sports,
      },
    );

    return result;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error(error.message); // Передаем только сообщение об ошибке
  }
}

export async function createRepeaten(form) {
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.repeatenCollectionId, // collectionId
      ID.unique(), // documentId
      {
        type: form.type,
        repeaten: form.repeat,
        calendar: form.calendarId,
        plan: {
          title: form.title,
          icon: form.icon,
          exercises: form.exercises,
          description: form.description,
        },
        weekDays: form.days,
      },
    );

    return result;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error(error.message); // Передаем только сообщение об ошибке
  }
}

export async function createPlan(form) {
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.planCollectionId, // collectionId
      ID.unique(), // documentId
      {
        title: form.title,
        icon: form.icon,
        exercises: form.exercises,
        description: form.description,
        date: form.date,
        calendarId: form.calendarId,
      },
    );

    return result;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw new Error(error.message); // Передаем только сообщение об ошибке
  }
}


export async function getAllUsers(callCount) {
  try {
    const limit = 10;
    const offset = callCount * limit; // Вычисляем смещение на основе количества вызовов функции

    const trainings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.orderDesc('$createdAt'), // сортируем по дате создания
        Query.limit(limit), // ограничиваем до 15 документов
        Query.offset(offset) // устанавливаем смещение
      ]
    );

    return trainings.documents;
  } catch (error) {
    throw new Error(`Ошибка получения данных: ${error.message}`);
  }
}

export async function getGymbros() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.gymbrosCollectionId
    );

    return users.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCo() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.coCollectionId
    );

    return users.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function deleteRoute(routeId) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.routesCollectionId,
      routeId
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deletePost(id) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export async function deleteTrack(trid) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.trackersCollectionId,
      trid
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export async function deleteNotification(nid) {
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notifsCollectionId,
      nid
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteOtherProgramms(programm) {
  try {
    const resultishe = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.planCollectionId,
      programm.plan.$id
    );

    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repeatenCollectionId,
      programm.$id
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserModels(userId) {
  try {
    const notifs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.modelsCollectionId,
      [Query.equal("userId", userId)]
    );

    return notifs.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserNotifications(userId) {
  try {
    const notifs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.notifsCollectionId,
      [Query.equal("userId", userId)]
    );

    return notifs.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMasters(role) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("role", role)]
    );

    return users.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getHotTrainings(userIds) {
  try {
    const trainings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [
        Query.equal('userId', userIds), // фильтруем по userId из списка
        Query.orderDesc('$createdAt'), // сортируем по дате создания
        Query.limit(5) // ограничиваем до 5 документов
      ]
    );

    return trainings.documents;
  } catch (error) {
    throw new Error(`Ошибка получения данных: ${error.message}`);
  }
}

export async function getRecommendedTrainings(callCount) {
  try {
    const limit = 5;
    const offset = callCount * limit; // Вычисляем смещение на основе количества вызовов функции

    const trainings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [
        Query.orderDesc('$createdAt'), // сортируем по дате создания
        Query.limit(limit), // ограничиваем до 5 документов
        Query.offset(offset) // устанавливаем смещение
      ]
    );

    return trainings.documents;
  } catch (error) {
    throw new Error(`Ошибка получения данных: ${error.message}`);
  }
}

export async function getUserCalendar(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.calendarCollectionId,
      [Query.equal("userId", userId)]
    );

    if (posts.documents.length === 0) {
      const created = await createCalendar(userId);
      return created;
    }
    else {
      return posts.documents;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserFriends(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.friendsCollectionId,
      [Query.equal("userId", userId)]
    );

    if (posts.documents.length === 0) {
      const created = await createFriends(userId);
      return created;
    }
    else {
      return posts.documents;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId)]
    );

    console.log('posts: ', posts.documents)

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getHotPosts(userIds) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.equal('creator', userIds), // фильтруем по userId из списка
        Query.orderDesc('$createdAt'), // сортируем по дате создания
        Query.limit(15) // ограничиваем до 20 документов
      ]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getComPosts(commsCollectionId) {
  try {
    // Получите список сообществ
    const communities = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.commsCollectionId);

    const posts = [];

    // Переберите каждое сообщество
    for (const community of communities.documents) {
      // Проверьте, что в сообществе есть контент
      if (community.content && Array.isArray(community.content)) {
        // Получите первые 10 объектов из content
        const contentPosts = community.content.slice(0, 10);
        posts.push(...contentPosts); // Добавьте в общий массив
      }
    }

    return posts;
  } catch (error) {
    throw new Error(`Error retrieving community posts: ${error.message}`);
  }
}

export async function getCalendarPlan(calendarId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.planCollectionId,
      [Query.equal("calendarId", calendarId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getUserMeal() {
  try {
    const mealDataString = await AsyncStorage.getItem('mealData');

    if (mealDataString !== null) {
      const mealData = JSON.parse(mealDataString); // Преобразуем строку обратно в объект
      return mealData; // Возвращаем данные
    } else {
      return null; // Если данных нет, возвращаем null
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserCommunities(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      [Query.arrayContains("users", userId)] // Используем Query.arrayContains для поиска по массиву
    );

    console.log('comms: ', posts)

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUsersCommunities(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserCompleted(userId) {
  try {
    const completed = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt")
      ]
    );

    return completed.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getTopUsersByTime() {
  try {
    const today = new Date();
    const date30DaysAgo = new Date(today);
    date30DaysAgo.setDate(today.getDate() - 30);

    const allDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [Query.greaterThan("\$createdAt", date30DaysAgo.toISOString())] // используем метаданные \$createdAt
    );

    const userTimeMap = {};

    allDocuments.documents.forEach(doc => {
      const { userId, time } = doc;

      if (!userTimeMap[userId]) {
        userTimeMap[userId] = 0;
      }

      userTimeMap[userId] += time;
    });

    const sortedUsers = Object.entries(userTimeMap)
      .sort((a, b) => b[1] - a[1]) // сортировка по времени
      .slice(0, 10); // топ 10

    return sortedUsers.map(([userId, totalTime]) => ({ userId, totalTime }));
  } catch (error) {
    throw new Error(error);
  }
}

export async function getTopUsersByDis() {
  try {
    const today = new Date();
    const date30DaysAgo = new Date(today);
    date30DaysAgo.setDate(today.getDate() - 30);

    const allDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [Query.greaterThan("\$createdAt", date30DaysAgo.toISOString())] // используем метаданные \$createdAt
    );

    const userDisMap = {};

    allDocuments.documents.forEach(doc => {
      const { userId, distance } = doc;

      if (!userDisMap[userId]) {
        userDisMap[userId] = 0;
      }

      userDisMap[userId] += distance;
    });

    const sortedUsers = Object.entries(userDisMap)
      .sort((a, b) => b[1] - a[1]) // сортировка по времени
      .slice(0, 10); // топ 10

    return sortedUsers.map(([userId, totalDis]) => ({ userId, totalDis }));
  } catch (error) {
    throw new Error(error);
  }
}


export async function getNews() {
  try {
    const news = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
    );

    return news.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getUserMap(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.mapCollectionId,
      [Query.equal("userId", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllRoutes() {
  try {
    const routes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.routesCollectionId,
      [Query.equal('isShown', true)] // Добавляем фильтр по isShown
    );

    return routes.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getAllCommunities() {
  try {
    const routes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
    );

    return routes.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function leaveCommunity(communityId, userId) {
  try {
    // Получаем документ сообщества
    const community = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      communityId
    );

    // Проверяем, есть ли пользователи в сообществе
    if (!community.users || !Array.isArray(community.users)) {
      throw new Error("Нет пользователей для удаления");
    }

    // Фильтруем пользователей, удаляя указанного
    const updatedUsers = community.users.filter(user => user !== userId);

    // Обновляем документ сообщества с обновленным списком пользователей
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      communityId,
      { users: updatedUsers }
    );

    return updatedUsers; // Возвращаем обновленный список пользователей
  } catch (error) {
    throw new Error(error);
  }
}

export async function joinCommunity(communityId, userId) {
  try {
    // Получаем документ сообщества
    const community = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      communityId
    );

    // Проверяем, есть ли пользователи в сообществе
    const users = community.users || [];

    // Проверяем, есть ли пользователь уже в списке
    if (users.includes(userId)) {
      throw new Error("Пользователь уже в сообществе");
    }

    // Добавляем пользователя в массив
    users.push(userId);

    // Обновляем документ сообщества с обновленным списком пользователей
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      communityId,
      { users }
    );

    return users; // Возвращаем обновленный список пользователей
  } catch (error) {
    throw new Error(error);
  }
}


export async function getUserTrackers(userId) {
  try {
    const trackers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.trackersCollectionId,
      [Query.equal("userId", userId)]
    );

    return trackers.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getUserTrainings(userId) {
  try {
    const trainings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.trainingsCollectionId,
      [Query.equal("creator", userId)]
    );

    return trainings.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserById(userId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('$id', userId)]
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCompleted(id) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.completedCollectionId,
      [Query.equal('$id', id)]
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getRoute(id) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.routesCollectionId,
      [Query.equal('$id', id)]
    );

    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getCommunityById(communityId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commsCollectionId,
      [Query.equal('$id', communityId)]
    );

    return result.documents[0];
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUsersByIds(userIds) {
  try {
    // Создаем массив промисов для получения данных о каждом пользователе
    const userPromises = userIds.map(userId =>
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('$id', userId)]
      )
    );

    // Ожидаем выполнения всех промисов
    const results = await Promise.all(userPromises);

    // Извлекаем имена и imageUrl из каждого результата
    const userInfos = results.map(result => {
      // Предполагаем, что `result.documents` - это массив документов
      // И выбираем имя и imageUrl первого пользователя в случае, если он найден
      if (result.documents.length > 0) {
        const user = result.documents[0];
        return {
          name: user.name,
          imageUrl: user.imageUrl,
          username: user.username,
          rank: user.rank,
          exp: user.exp,
          bio: user.bio,
        };
      }
      return null; // Если пользователь не найден, возвращаем null
    });

    return userInfos.filter(info => info !== null); // Убираем null значения из результата
  } catch (error) {
    throw new Error(error);
  }
}

export async function getFullUsersByIds(userIds) {
  try {
    // Создаем массив промисов для получения данных о каждом пользователе
    const userPromises = userIds.map(userId =>
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('$id', userId)]
      )
    );

    // Ожидаем выполнения всех промисов
    const results = await Promise.all(userPromises);

    // Извлекаем имена и imageUrl из каждого результата
    const userInfos = results.map(result => {
      // Предполагаем, что `result.documents` - это массив документов
      // И выбираем имя и imageUrl первого пользователя в случае, если он найден
      if (result.documents.length > 0) {
        const user = result.documents[0];
        return {
          name: user.name, // Предполагается, что поле с именем называется "name"
          imageUrl: user.imageUrl // Предполагается, что поле с URL изображения называется "imageUrl"
        };
      }
      return null; // Если пользователь не найден, возвращаем null
    });

    return userInfos.filter(info => info !== null); // Убираем null значения из результата
  } catch (error) {
    throw new Error(error);
  }
}


export async function getAwardsByIds(ids) {
  try {
    // Создаем массив промисов для получения данных о каждом пользователе
    const userPromises = ids.map(userId =>
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.awardsCollectionId,
        [Query.equal('$id', userId)]
      )
    );

    // Ожидаем выполнения всех промисов
    const results = await Promise.all(userPromises);

    // Извлекаем имена и imageUrl из каждого результата
    const userInfos = results.map(result => {
      // Предполагаем, что `result.documents` - это массив документов
      // И выбираем имя и imageUrl первого пользователя в случае, если он найден
      if (result.documents.length > 0) {
        const user = result.documents[0];
        return {
          name: user.name, // Предполагается, что поле с именем называется "name"
          imageUrl: user.imageUrl, // Предполагается, что поле с URL изображения называется "imageUrl"
          description: user.description, // Предполагается, что поле с URL изображения называется "imageUrl"
          price: user.price // Предполагается, что поле с URL изображения называется "imageUrl"
        };
      }
      return null; // Если пользователь не найден, возвращаем null
    });

    return userInfos.filter(info => info !== null); // Убираем null значения из результата
  } catch (error) {
    throw new Error(error);
  }
}


export async function getTrainingsForYou(sports) {
  try {
    const trainings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.trainingsCollectionId
    );

    // Фильтруем тренировки по виду спорта
    const filteredTrainings = trainings.documents.filter(training =>
      sports.includes(training.kind)
    );

    return filteredTrainings;
  } catch (error) {
    throw new Error(error);
  }
}



// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getMasterModels(masterId, archived = false) {
  try {
    // Получаем все модели
    const models = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.modelsCollectionId,
      [Query.equal("archived", archived)]
    );

    // Фильтруем модели, где в массиве masters есть мастер с указанным id
    const filteredModels = models.documents.filter(model =>
      model.masters &&
      model.masters.some(master => master.id === masterId)
    );

    return filteredModels;
  } catch (error) {
    console.error('Ошибка при получении моделей мастера:', error);
    throw new Error(error);
  }
}

export async function getModels() {
  try {
    const models = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.modelsCollectionId,
      [Query.equal("archived", false)]
    );

    return models.documents;
  } catch (error) {
    console.error('Ошибка при получении моделей:', error);
    throw new Error(`Ошибка при получении моделей: ${error.message}`);
  }
}
