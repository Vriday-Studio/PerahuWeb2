import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '@/app/firebase';

export const uploadMultipleImages = async (files, folderName = "images") => {
    const arrayFiles = Array.from(files);
    const uploadPromises = arrayFiles.map(async (file) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const storageRef = ref(storage, `${folderName}/${uniqueName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    });

    return Promise.all(uploadPromises);
};

export const uploadSingleFile = async (file, folderName = "images") => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const storageRef = ref(storage, `${folderName}/${uniqueName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}
