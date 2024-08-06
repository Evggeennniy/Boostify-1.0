import asyncio
import aiomcache

import pickle


class aCacheClient(aiomcache.Client):
    """
    Asynchronous cache object
    """

    async def set(self, key, value, exptime=0):
        """
        Fixed*
        The original function must get key and value in bytes
        """
        key, value = str(key).encode('utf-8'), pickle.dumps(value)
        await super().set(key=key, value=value, exptime=exptime)

    async def get(self, key, default=None):
        """
        Fixed*
        The original function must get key in bytes
        """
        key = str(key).encode('utf-8')
        value = await super().get(key=key, default=default)
        if value:
            return pickle.loads(value)
        return None
