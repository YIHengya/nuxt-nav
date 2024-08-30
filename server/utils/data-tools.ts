// utils/data-tools.js
import { promises as fs } from 'fs'
import { resolve } from 'path'

const FILE_PATH = resolve(process.cwd(), './content/data.json')

async function readJsonFile() {
  const data = await fs.readFile(FILE_PATH, 'utf8')
  return JSON.parse(data)['body']
}

async function writeJsonFile(data: any) {
  await fs.writeFile(FILE_PATH, JSON.stringify({ body: data }, null, 2))
}

export async function addCategory(category: any, description: any) {
  const data = await readJsonFile();
  const newCategory = {
    id: Date.now(), // 使用时间戳作为唯一ID
    category,
    description,
    links: []
  };
  data.push(newCategory);
  await writeJsonFile(data);
}

export async function addLinkToCategory(categoryName: any, link: any) {
  const data = await readJsonFile()
  const category = data.find((item: { category: any }) => item.category === categoryName)
  if (category) {
    category.links.push(link)
    await writeJsonFile(data)
  } else {
    throw new Error(`Category "${categoryName}" not found`)
  }
}



export async function deleteLinkFromCategory(categoryName: any, linkName: any) {
  const data = await readJsonFile()
  const category = data.find((item: { category: any }) => item.category === categoryName)
  if (category) {
    category.links = category.links.filter((link: { name: any }) => link.name !== linkName)
    await writeJsonFile(data)
  } else {
    throw new Error(`Category "${categoryName}" not found`)
  }
}

// 根据id删除分类
export async function deleteCategoryById(categoryId: any) {
  let data = await readJsonFile()
  data = data.filter((item: { id: any }) => item.id !== categoryId)
  await writeJsonFile(data)
}

export async function deleteCategory(categoryName: any) {
  let data = await readJsonFile()
  data = data.filter((item: { category: any }) => item.category !== categoryName)
  await writeJsonFile(data)
}


// 新增的编辑分类的方法
export async function editCategoryById(categoryId: any, newCategory: any, newDescription: any) {
  const data = await readJsonFile();
  const category = data.find((item: { id: any }) => item.id === categoryId);
  if (category) {
    category.category = newCategory;
    category.description = newDescription;
    await writeJsonFile(data);
  } else {
    throw new Error(`Category with ID "${categoryId}" not found`);
  }
}

export async function addToolToCategory(categoryId: number, tool: any) {
  const data = await readJsonFile();
  const category = data.find((item: { id: number }) => item.id === categoryId);
  if (category) {
    // 确保 links 数组存在
    if (!category.links) {
      category.links = [];
    }
    // 为新工具生成一个唯一ID，并移除 categoryId
    const { categoryId: _, ...toolWithoutCategoryId } = tool;

    // 如果图标链接为空，自动生成
    if (!toolWithoutCategoryId.icon || toolWithoutCategoryId.icon.trim() === '') {
      toolWithoutCategoryId.icon = getDuckDuckGoFaviconUrl(toolWithoutCategoryId.url);
    }

    const newTool = {
      ...toolWithoutCategoryId,
      id: Date.now() // 使用时间戳作为唯一ID
    };
    category.links.push(newTool);
    await writeJsonFile(data);
    return newTool; // 返回新添加的工具，包括生成的ID
  } else {
    throw new Error(`Category with ID "${categoryId}" not found`);
  }
}


export async function deleteToolById(toolId: number) {
  const data = await readJsonFile();
  let toolDeleted = false;

  for (let i = 0; i < data.length; i++) {
    const category = data[i];
    if (category.links) {
      const toolIndex = category.links.findIndex((tool: { id: number }) => tool.id === toolId);
      if (toolIndex !== -1) {
        // 找到了工具，从数组中删除
        category.links.splice(toolIndex, 1);
        toolDeleted = true;
        break; // 工具已找到并删除，退出循环
      }
    }
  }

  if (toolDeleted) {
    await writeJsonFile(data);
    return { success: true, message: `Tool with ID "${toolId}" has been deleted.` };
  } else {
    throw new Error(`Tool with ID "${toolId}" not found.`);
  }
}

export async function updateToolById(toolId: any, updatedTool: any) {
  const data = await readJsonFile();
  let toolUpdated = false;

  for (let category of data) {
    if (category.links) {
      const toolIndex = category.links.findIndex((tool: { id: number }) => tool.id === toolId);
      if (toolIndex !== -1) {
        // 找到了工具，更新其内容
        const currentTool = category.links[toolIndex];
        
        // 更新工具的各个字段，如果提供了新值的话
        if (updatedTool.name !== undefined) currentTool.name = updatedTool.name;
        if (updatedTool.description !== undefined) currentTool.description = updatedTool.description;
        if (updatedTool.url !== undefined) {
          currentTool.url = updatedTool.url;
          // 如果 URL 改变，自动更新图标
          currentTool.icon = getDuckDuckGoFaviconUrl(currentTool.url);
        }
        if (updatedTool.icon !== undefined) {
          currentTool.icon = updatedTool.icon;
        }
        
        // 如果图标为空，自动获取
        if (!currentTool.icon || currentTool.icon.trim() === '') {
          currentTool.icon = getDuckDuckGoFaviconUrl(currentTool.url);
        }
        
        // 如果需要更新 categoryId，我们需要将工具移动到新的分类
        if (updatedTool.categoryId !== undefined && updatedTool.categoryId !== category.id) {
          const newCategory = data.find((item: { id: number }) => item.id === updatedTool.categoryId);
          if (newCategory) {
            // 从当前分类中移除
            category.links.splice(toolIndex, 1);
            // 添加到新分类
            if (!newCategory.links) newCategory.links = [];
            newCategory.links.push(currentTool);
          } else {
            throw new Error(`Category with ID "${updatedTool.categoryId}" not found`);
          }
        }

        toolUpdated = true;
        break; // 工具已找到并更新，退出循环
      }
    }
  }

  if (toolUpdated) {
    await writeJsonFile(data);
    return { success: true, message: `Tool with ID "${toolId}" has been updated.` };
  } else {
    throw new Error(`Tool with ID "${toolId}" not found.`);
  }
}

// 辅助函数：获取网站图标
function getDuckDuckGoFaviconUrl(url: string): string {
  return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
}
