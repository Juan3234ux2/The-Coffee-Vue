export default function getFileUrl(collectionId, recordId, fileName) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/files/${collectionId}/${recordId}/${fileName}`;
    return url;
}
