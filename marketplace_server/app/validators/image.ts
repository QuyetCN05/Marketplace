export default class ImageValidator {
  public checkImageType(multypartFile: any): boolean {
    const imageType = ['png', 'jpeg', 'jpg']
    return imageType.includes(multypartFile.subtype)
  }

  public checkImageSize(multypartFile: any): boolean {
    //check image size < 5Mb
    return multypartFile.size < 5000000
  }
}
