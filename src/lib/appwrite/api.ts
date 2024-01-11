import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, database } from "./config";
import { Databases, ID, Query } from "appwrite";



export const createUserAccount = async (user:INewUser) => {
    
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.name,
            user.password


        )
        if(!newAccount) throw Error
        const avaterUrl = avatars.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountId:newAccount.$id,
            email:newAccount.email,
            name:newAccount.name,
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