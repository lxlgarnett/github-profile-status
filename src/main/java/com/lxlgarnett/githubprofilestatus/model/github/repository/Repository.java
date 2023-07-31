/*
 * Created by Xiaolei Li on 7/31/23, 8:01 PM
 * Copyright (c) 2023 Xiaolei Li.
 * All rights reserved.
 * Last modified 7/31/23, 7:58 PM
 */

package com.lxlgarnett.githubprofilestatus.model.github.repository;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

/**
 * Model class of response for "https://api.github.com/users/{userName}/repos"
 *
 * @author xiaolei
 */
public class Repository {

    @JsonProperty(value = "id")
    private Long id;

    @JsonProperty(value = "name")
    private String name;

    @JsonProperty(value = "full_name")
    private String fullName;

    @JsonProperty(value = "html_url")
    private String htmlUrl;

    @JsonProperty(value = "description")
    private String description;

    @JsonProperty(value = "languages_url")
    private String languagesUrl;

    @JsonProperty(value = "fork")
    private boolean fork;

    @JsonProperty(value = "url")
    private String url;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getHtmlUrl() {
        return htmlUrl;
    }

    public void setHtmlUrl(String htmlUrl) {
        this.htmlUrl = htmlUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLanguagesUrl() {
        return languagesUrl;
    }

    public void setLanguagesUrl(String languagesUrl) {
        this.languagesUrl = languagesUrl;
    }

    public boolean isFork() {
        return fork;
    }

    public void setFork(boolean fork) {
        this.fork = fork;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Repository that = (Repository) o;

        if (fork != that.fork) return false;
        if (!id.equals(that.id)) return false;
        if (!Objects.equals(name, that.name)) return false;
        if (!Objects.equals(fullName, that.fullName)) return false;
        if (!htmlUrl.equals(that.htmlUrl)) return false;
        if (!Objects.equals(description, that.description)) return false;
        if (!Objects.equals(languagesUrl, that.languagesUrl)) return false;
        return url.equals(that.url);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (fullName != null ? fullName.hashCode() : 0);
        result = 31 * result + htmlUrl.hashCode();
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (languagesUrl != null ? languagesUrl.hashCode() : 0);
        result = 31 * result + (fork ? 1 : 0);
        result = 31 * result + url.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Repository{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", fullName='" + fullName + '\'' +
                ", htmlUrl='" + htmlUrl + '\'' +
                ", description='" + description + '\'' +
                ", languagesUrl='" + languagesUrl + '\'' +
                ", fork=" + fork +
                ", url='" + url + '\'' +
                '}';
    }
}
