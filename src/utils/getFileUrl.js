export default function getFileUrl(collectionId, recordId, fileName) {
    const baseUrl = 'http://localhost:8090';
    const url = `${baseUrl}/api/files/${collectionId}/${recordId}/${fileName}`;
    return url;
}
