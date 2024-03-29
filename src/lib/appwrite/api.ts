import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, database , storage } from "./config";
import { Databases, ID, Query } from "appwrite";




export const createUserAccount = async (user:INewUser) => {
    
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name


        )
        if(!newAccount) throw Error

        const avaterUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId:newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username: user.username,
            imageUrl: avaterUrl

        })

        return newUser
        
    } catch (error) {
        console.log(error)
        return error
       
        
    }


}

export const saveUserToDB = async (user: {
    accountId: string
    email:string
    name:string
    imageUrl:URL
    username?:string
}) => {
    try {
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
        
    } catch (error) {
        console.log(error)
        
    }

}

export const signInAccount = async (user: {email:string ; password:string} ) => {
    try {
        const session = await account.createEmailSession(user.email , user.password)
        return session
        
    } catch (error) {
        console.log(error)
        
    }

}
export const signOutAccount = async () => {
    try {
        const session = await account.deleteSession('current')
        return session
        
    } catch (error) {
        console.log(error)
        
    }

}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if(!currentAccount) throw Error
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId' , currentAccount.$id)]
        )

        if(!currentUser) throw Error

        return currentUser.documents[0]
        
    } catch (error) {
        console.log(error)
        
    }

}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        // imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
    
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.StorageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.StorageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.StorageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export const getRecentPost = async () => {
  const post = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt') , Query.limit(20)]
  )
  if(!post) throw Error

  return post

}

export const likePost = async (postId: string , likesArray: string[]) => {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatedPost) throw Error

    return updatedPost


    
  } catch (error) {
    console.log(error)
    
  }

}
export const savePost = async (postId: string , userId: string) => {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )
    if(!updatedPost) throw Error

    return updatedPost


    
  } catch (error) {
    console.log(error)
    
  }

}
export const deleteSavedPost = async (savedRecordId: string ) => {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      savedRecordId
    
    )
    if(!statusCode) throw Error

    return {status: 'Ok'}


    
  } catch (error) {
    console.log(error)
    
  }

}