# API Usage Examples

## Client-Side tRPC Usage

### List Clients with Pagination

```typescript
"use client";

import { trpc } from "@/lib/trpc/client";

export function ClientsList() {
  const { data, isLoading, error } = trpc.clients.list.useQuery({
    page: 1,
    limit: 10,
    status: "ACTIVE",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Clients ({data.metadata.total})</h2>
      <ul>
        {data.items.map((client) => (
          <li key={client.id}>
            {client.name} - {client.company}
          </li>
        ))}
      </ul>
      {data.metadata.hasMore && <button>Load More</button>}
    </div>
  );
}
```

### Create New Client

```typescript
"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

export function CreateClientForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const utils = trpc.useContext();
  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      setName("");
      setCompany("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient.mutate({ name, company, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={createClient.isLoading}>
        {createClient.isLoading ? "Creating..." : "Create Client"}
      </button>
      {createClient.error && (
        <div className="error">{createClient.error.message}</div>
      )}
    </form>
  );
}
```

### Update Project Status

```typescript
"use client";

import { trpc } from "@/lib/trpc/client";
import { ProjectStatus } from "@nexurops/types";

export function ProjectStatusUpdater({ projectId }: { projectId: string }) {
  const utils = trpc.useContext();
  const updateStatus = trpc.projects.updateStatus.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      utils.projects.getById.invalidate({ id: projectId });
    },
  });

  const handleStatusChange = (status: ProjectStatus) => {
    updateStatus.mutate({ id: projectId, status });
  };

  return (
    <select
      onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
      disabled={updateStatus.isLoading}
    >
      <option value={ProjectStatus.DRAFT}>Draft</option>
      <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
      <option value={ProjectStatus.COMPLETED}>Completed</option>
      <option value={ProjectStatus.ON_HOLD}>On Hold</option>
      <option value={ProjectStatus.CANCELLED}>Cancelled</option>
    </select>
  );
}
```

## Server-Side tRPC Usage

### Server Component

```typescript
import { createContext } from "@/lib/trpc/context";
import { appRouter } from "@/lib/trpc/routers";

export default async function ClientsPage() {
  const ctx = await createContext();
  const caller = appRouter.createCaller(ctx);

  const clients = await caller.clients.list({
    page: 1,
    limit: 10,
  });

  return (
    <div>
      <h1>Clients</h1>
      <ul>
        {clients.items.map((client) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Authentication Examples

### Get Current User

```typescript
"use client";

import { trpc } from "@/lib/trpc/client";

export function UserProfile() {
  const { data: user, isLoading } = trpc.auth.getCurrentUser.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### Protected Page

```typescript
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>Please sign in</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## LinkedIn Bot Integration

### Generate and Publish Post

```typescript
"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

export function LinkedInPostGenerator() {
  const [topic, setTopic] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const generatePost = trpc.linkedin.generatePost.useMutation({
    onSuccess: (data) => {
      setGeneratedText(data.text);
    },
  });

  const publishPost = trpc.linkedin.publishPost.useMutation({
    onSuccess: () => {
      alert("Post published successfully!");
      setGeneratedText("");
      setTopic("");
    },
  });

  return (
    <div>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
      />
      <button
        onClick={() =>
          generatePost.mutate({
            topic,
            tone: "professional",
            length: "medium",
            includeHashtags: true,
          })
        }
        disabled={generatePost.isLoading}
      >
        Generate Post
      </button>

      {generatedText && (
        <div>
          <textarea value={generatedText} readOnly rows={10} />
          <button
            onClick={() => publishPost.mutate({ text: generatedText })}
            disabled={publishPost.isLoading}
          >
            Publish to LinkedIn
          </button>
        </div>
      )}
    </div>
  );
}
```
