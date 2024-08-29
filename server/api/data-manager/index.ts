export default defineEventHandler(async (event) => {
  try {
    const { action, data } = await readBody(event)

    switch (action) {
      case 'addCategory':
        const addedCategory = await addCategory(data.category, data.description)
        return {
          success: true,
          message: 'Category added successfully',
          data: addedCategory
        }
      case 'addLinkToCategory':
        const addedLink = await addLinkToCategory(data.categoryName, data.link)
        return {
          success: true,
          message: 'Link added to category successfully',
          data: addedLink
        }
      case 'deleteCategory':
        await deleteCategory(data.categoryName)
        return {
          success: true,
          message: 'Category deleted successfully',
          data: { deletedCategory: data.categoryName }
        }
      case 'deleteLinkFromCategory':
        const updatedCategory = await deleteLinkFromCategory(data.categoryName, data.linkName)
        return {
          success: true,
          message: 'Link deleted from category successfully',
          data: updatedCategory
        }
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
      error: ""
    }
  }
})
