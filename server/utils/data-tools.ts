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