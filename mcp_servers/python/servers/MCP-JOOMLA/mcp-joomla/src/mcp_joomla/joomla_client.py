import os
import httpx
import json
import re
import markdown
import bleach
from typing import Optional, Dict, Any

class JoomlaClient:
    def __init__(self):
        self.base_url = None
        self.bearer_token = None
        self.articles_api_url = None
        self.categories_api_url = None
        self._initialized = False

    def initialize(self, base_url: str, bearer_token: str):
        """Initialize the Joomla client with credentials."""
        self.base_url = base_url.rstrip("/")
        self.bearer_token = bearer_token
        self.articles_api_url = f"{self.base_url}/api/index.php/v1/content/articles"
        self.categories_api_url = f"{self.base_url}/api/index.php/v1/content/categories"
        self.users_api_url = f"{self.base_url}/api/index.php/v1/users"
        self.menus_api_url = f"{self.base_url}/api/index.php/v1/menus"
        self._initialized = True

    def is_initialized(self) -> bool:
        """Check if the client has been initialized with credentials."""
        return self._initialized

    def get_headers(self) -> Dict[str, str]:
        """Get the standard headers for API requests."""
        if not self.is_initialized():
            raise ValueError("Joomla client not initialized. Please provide base_url and bearer_token.")
        
        return {
            "Accept": "application/vnd.api+json",
            "User-Agent": "JoomlaArticlesMCP/1.0",
            "Authorization": f"Bearer {self.bearer_token}",
        }

    def generate_alias(self, title: str) -> str:
        """Convert a title to a slug alias (lowercase, hyphens, no special chars)."""
        alias = re.sub(r"[^a-z0-9\s-]", "", title.lower())
        alias = re.sub(r"\s+", "-", alias).strip("-")
        return alias

    def convert_text_to_html(self, text: str) -> str:
        """
        Convert plain text to sanitized HTML using markdown and bleach.

        Args:
            text (str): The plain text to convert.

        Returns:
            str: Sanitized HTML content with allowed tags only.
        """
        html = markdown.markdown(text)
        allowed_tags = [
            "p", "br", "strong", "em", "ul", "ol", "li",
            "h1", "h2", "h3", "h4", "h5", "h6",
        ]
        allowed_attributes = {}
        sanitized_html = bleach.clean(
            html, tags=allowed_tags, attributes=allowed_attributes, strip=True
        )
        return sanitized_html

    async def get_articles(self) -> Dict[str, Any]:
        """Retrieve all articles from the Joomla website."""
        headers = self.get_headers()
        async with httpx.AsyncClient() as client:
            response = await client.get(self.articles_api_url, headers=headers)
        
        if response.status_code == 200:
            return {"success": True, "data": response.text}
        else:
            return {
                "success": False, 
                "error": f"Failed to fetch articles: HTTP {response.status_code} - {response.text}"
            }

    async def get_categories(self) -> Dict[str, Any]:
        """Retrieve all categories from the Joomla website."""
        headers = self.get_headers()
        async with httpx.AsyncClient() as client:
            response = await client.get(self.categories_api_url, headers=headers)
        
        if response.status_code != 200:
            return {
                "success": False,
                "error": f"Failed to fetch categories: HTTP {response.status_code} - {response.text}"
            }
        
        try:
            data = json.loads(response.text)
            categories = data.get("data", [])
            if not isinstance(categories, list):
                return {
                    "success": False,
                    "error": f"Error: Expected a list of categories, got {type(categories).__name__}"
                }
            
            return {"success": True, "data": categories}
        except json.JSONDecodeError:
            return {
                "success": False,
                "error": f"Error parsing categories response: Invalid JSON - {response.text}"
            }

    async def create_article(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new article on the Joomla website."""
        headers = self.get_headers()
        headers["Content-Type"] = "application/json"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(self.articles_api_url, json=payload, headers=headers)
        
        if response.status_code in (200, 201):
            return {"success": True, "data": response.text}
        else:
            return {
                "success": False,
                "error": f"Failed to create article: HTTP {response.status_code} - {response.text}"
            }

    async def get_article(self, article_id: int) -> Dict[str, Any]:
        """Get a specific article by ID."""
        headers = self.get_headers()
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.articles_api_url}/{article_id}", headers=headers)
        
        if response.status_code == 200:
            try:
                data = json.loads(response.text)
                return {"success": True, "data": data}
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": f"Failed to parse article data: Invalid JSON - {response.text}"
                }
        else:
            return {
                "success": False,
                "error": f"Failed to fetch article: HTTP {response.status_code} - {response.text}"
            }

    async def update_article(self, article_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing article."""
        headers = self.get_headers()
        headers["Content-Type"] = "application/json"
        
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{self.articles_api_url}/{article_id}", json=payload, headers=headers)
        
        if response.status_code in (200, 204):
            return {"success": True, "data": response.text}
        else:
            return {
                "success": False,
                "error": f"Failed to update article: HTTP {response.status_code} - {response.text}"
            }

    async def search_articles(self, search_params: Dict[str, Any]) -> Dict[str, Any]:
        """Search for articles based on various criteria."""
        headers = self.get_headers()

        async with httpx.AsyncClient() as client:
            response = await client.get(self.articles_api_url, params=search_params, headers=headers)

        if response.status_code == 200:
            try:
                data = json.loads(response.text)
                articles = []
                for item in data.get("data", []):
                    articles.append({
                        "id": item.get("id"),
                        "title": item.get("attributes", {}).get("title"),
                        "alias": item.get("attributes", {}).get("alias"),
                        "state": item.get("attributes", {}).get("state"),
                        "catid": item.get("attributes", {}).get("catid"),
                        "created": item.get("attributes", {}).get("created"),
                        "introtext": item.get("attributes", {}).get("introtext", "")[:100] + "..." if len(item.get("attributes", {}).get("introtext", "")) > 100 else item.get("attributes", {}).get("introtext", "")
                    })

                return {"success": True, "data": json.dumps(articles, indent=2)}
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": f"Error parsing search response: Invalid JSON - {response.text}"
                }
        else:
            return {
                "success": False,
                "error": f"Failed to search articles: HTTP {response.status_code} - {response.text}"
            }

    async def get_users(self, limit: int = 20) -> Dict[str, Any]:
        """Get all users from the Joomla website."""
        headers = self.get_headers()
        params = {"page[limit]": limit}

        async with httpx.AsyncClient() as client:
            response = await client.get(self.users_api_url, params=params, headers=headers)

        if response.status_code == 200:
            try:
                data = json.loads(response.text)
                users = []
                for item in data.get("data", []):
                    users.append({
                        "id": item.get("id"),
                        "name": item.get("attributes", {}).get("name"),
                        "username": item.get("attributes", {}).get("username"),
                        "email": item.get("attributes", {}).get("email"),
                        "block": item.get("attributes", {}).get("block"),
                        "registerDate": item.get("attributes", {}).get("registerDate"),
                        "lastvisitDate": item.get("attributes", {}).get("lastvisitDate")
                    })

                return {"success": True, "data": json.dumps(users, indent=2)}
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": f"Error parsing users response: Invalid JSON - {response.text}"
                }
        else:
            return {
                "success": False,
                "error": f"Failed to fetch users: HTTP {response.status_code} - {response.text}"
            }

    async def get_user(self, user_id: int) -> Dict[str, Any]:
        """Get a specific user by ID."""
        headers = self.get_headers()
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.users_api_url}/{user_id}", headers=headers)

        if response.status_code == 200:
            return {"success": True, "data": response.text}
        else:
            return {
                "success": False,
                "error": f"Failed to fetch user: HTTP {response.status_code} - {response.text}"
            }

    async def get_menus(self, menu_type: Optional[str] = None) -> Dict[str, Any]:
        """Get all menus or a specific menu type."""
        headers = self.get_headers()
        params = {}
        if menu_type:
            params["filter[menutype]"] = menu_type

        async with httpx.AsyncClient() as client:
            response = await client.get(self.menus_api_url, params=params, headers=headers)

        if response.status_code == 200:
            try:
                data = json.loads(response.text)
                menus = []
                for item in data.get("data", []):
                    menus.append({
                        "id": item.get("id"),
                        "title": item.get("attributes", {}).get("title"),
                        "alias": item.get("attributes", {}).get("alias"),
                        "menutype": item.get("attributes", {}).get("menutype"),
                        "level": item.get("attributes", {}).get("level"),
                        "parent_id": item.get("attributes", {}).get("parent_id"),
                        "published": item.get("attributes", {}).get("published")
                    })

                return {"success": True, "data": json.dumps(menus, indent=2)}
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": f"Error parsing menus response: Invalid JSON - {response.text}"
                }
        else:
            return {
                "success": False,
                "error": f"Failed to fetch menus: HTTP {response.status_code} - {response.text}"
            }

    async def get_site_info(self) -> Dict[str, Any]:
        """Get general site information."""
        headers = self.get_headers()

        # Try to get basic site info from the API root
        async with httpx.AsyncClient() as client:
            try:
                # Get site configuration info
                config_url = f"{self.base_url}/api/index.php/v1/config/application"
                response = await client.get(config_url, headers=headers)

                if response.status_code == 200:
                    data = json.loads(response.text)
                    site_info = {
                        "site_name": data.get("data", {}).get("attributes", {}).get("sitename", "Unknown"),
                        "api_version": "v1",
                        "base_url": self.base_url,
                        "status": "Connected"
                    }
                    return {"success": True, "data": json.dumps(site_info, indent=2)}
                else:
                    # Fallback to basic info
                    site_info = {
                        "base_url": self.base_url,
                        "api_version": "v1",
                        "status": "Connected (Limited Info)",
                        "note": "Full site configuration not accessible"
                    }
                    return {"success": True, "data": json.dumps(site_info, indent=2)}
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Failed to fetch site info: {str(e)}"
                }

# Global instance
joomla_client = JoomlaClient()