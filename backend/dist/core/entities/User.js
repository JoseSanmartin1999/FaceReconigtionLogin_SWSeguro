export class User {
    constructor(props) {
        this.props = props;
    }
    // Getters para acceder a las propiedades
    get id() {
        return this.props.id;
    }
    get username() {
        return this.props.username;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get email() {
        return this.props.email;
    }
    get role() {
        return this.props.role;
    }
    // Helper: nombre completo
    get fullName() {
        return `${this.props.firstName} ${this.props.lastName}`;
    }
}
//# sourceMappingURL=User.js.map