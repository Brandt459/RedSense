from threading import Lock


user_states = {}
global_lock = Lock()


def lock_and_get_state(username):
    with global_lock:
        if username not in user_states:
            user_states[username] = {'analyzing_posts': False}

        return user_states[username]
