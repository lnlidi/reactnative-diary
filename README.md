- subjects (коллекция предметов)
  - {subjectId} (документ предмета)
    - name: string (название предмета)
    - description: string (описание предмета)
    - createdBy: string (идентификатор пользователя, создавшего предмет)
    - createdAt: timestamp (дата и время создания предмета)

- members (коллекция участников)
  - {memberId} (документ участника)
    - subjectId: string (идентификатор предмета, к которому относится участник)
    - userId: string (идентификатор пользователя)
    - role: string (роль участника в предмете)
    - joinedAt: timestamp (дата и время присоединения участника)

- assignments (коллекция заданий)
  - {assignmentId} (документ задания)
    - subjectId: string (идентификатор предмета, к которому относится задание)
    - title: string (название задания)
    - description: string (описание задания)
    - createdAt: timestamp (дата и время создания задания)
    - dueDate: timestamp (дата и время сдачи задания)
    - maxPoints: number (максимальное количество баллов за задание)
    - attachments: array of strings (прикрепленные файлы или ссылки)

- results (коллекция результатов)
  - {resultId} (документ результата)
    - assignmentId: string (идентификатор задания, к которому относится результат)
    - userId: string (идентификатор пользователя, связанного с результатом)
    - score: number (результат или оценка)
    - submittedAt: timestamp (дата и время отправки результата)

- messages (коллекция сообщений)
  - {messageId} (документ сообщения)
    - subjectId: string (идентификатор предмета, к которому относится сообщение)
    - userId: string (идентификатор пользователя, отправившего сообщение)
    - text: string (текст сообщения)
    - createdAt: timestamp (дата и время создания сообщения)

- users (коллекция пользователей)
  - {userId} (документ пользователя)
    - name: string (имя пользователя)
    - email: string (электронная почта пользователя)
    - role: string (роль пользователя)
    - createdAt: timestamp (дата и время создания пользователя)
