import { defineEventHandler, readBody } from 'h3'
import { deleteCategoryById, editCategoryById } from '~/server/utils/data-tools'

let lastRequestTime = 0
const RATE_LIMIT_INTERVAL = 1000 // 5 seconds in milliseconds

export default defineEventHandler(async (event) => {
  const currentTime = Date.now()

  // Check if the rate limit interval has passed
  if (currentTime - lastRequestTime < RATE_LIMIT_INTERVAL) {
    return {
      success: false,
      message: "Rate limit exceeded. Please try again later.",
      error: "RATE_LIMIT_EXCEEDED"
    }
  }

  // Update the last request time
  lastRequestTime = currentTime

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
      case 'deleteLinkFromCategory':
        const updatedCategory = await deleteLinkFromCategory(data.categoryName, data.linkName)
        return {
          success: true,
          message: 'Link deleted from category successfully',
          data: updatedCategory
        }
      case 'deleteCategory':
        const deleteCategory= await deleteCategoryById(data.id)
        return {
          success: true,
          message: 'Link deleted from category successfully',
          data: deleteCategory
        }
      case 'editCategory': // 新增的 case
        await editCategoryById(data.id, data.category, data.description);
        return {
          success: true,
          message: 'Category edited successfully'
        };
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred",
      error: error instanceof Error ? error.message : String(error)
    }
  }
})